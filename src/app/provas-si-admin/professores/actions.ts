'use server'

import { requireAuth } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addProfessor(formData: FormData) {
  const { supabase } = await requireAuth()
  const nome = formData.get('nome') as string
  const email = formData.get('email') as string

  if (!nome) return { error: 'O nome é obrigatório.' }

  const { error } = await supabase.from('professores').insert({ nome, email })
  
  if (error) {
    return { error: error.message }
  }

  revalidatePath('/provas-si-admin/professores')
  return { success: true }
}

export async function editProfessor(formData: FormData) {
  const { supabase } = await requireAuth()
  const id = formData.get('id') as string
  const nome = formData.get('nome') as string
  const email = formData.get('email') as string

  if (!id || !nome) return { error: 'O ID e o nome são obrigatórios.' }

  const { error } = await supabase.from('professores').update({ nome, email }).eq('id', id)
  
  if (error) {
    return { error: error.message }
  }

  revalidatePath('/provas-si-admin/professores')
  return { success: true }
}

export async function deleteProfessor(id: string) {
  const { supabase } = await requireAuth()
  const { error } = await supabase.from('professores').delete().eq('id', id)
  
  if (error) {
    return { error: error.message }
  }

  revalidatePath('/provas-si-admin/professores')
  return { success: true }
}
