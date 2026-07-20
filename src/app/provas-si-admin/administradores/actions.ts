'use server'

import { requireAuth } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function addAdmin(formData: FormData) {
  await requireAuth() // Apenas usuários logados podem usar
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'E-mail e senha são obrigatórios.' }
  }

  const supabaseAdmin = createAdminClient()
  const { error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true // Pula verificação de email
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/provas-si-admin/administradores')
  return { success: true }
}

export async function editAdmin(formData: FormData) {
  await requireAuth()
  
  const id = formData.get('id') as string
  const password = formData.get('password') as string

  if (!id) return { error: 'ID do administrador é obrigatório.' }

  // Se não passou senha nova, não fazemos nada
  if (!password) {
    return { success: true }
  }

  const supabaseAdmin = createAdminClient()
  const { error } = await supabaseAdmin.auth.admin.updateUserById(id, {
    password
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/provas-si-admin/administradores')
  return { success: true }
}

export async function deleteAdmin(id: string) {
  await requireAuth()

  const supabaseAdmin = createAdminClient()
  
  // Bloquear se houver apenas 1 admin
  const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers()
  if (listError) return { error: listError.message }
  
  if (users.users.length <= 1) {
    return { error: 'Não é possível excluir o único administrador do sistema.' }
  }

  const { error } = await supabaseAdmin.auth.admin.deleteUser(id)
  
  if (error) {
    return { error: error.message }
  }

  revalidatePath('/provas-si-admin/administradores')
  return { success: true }
}
