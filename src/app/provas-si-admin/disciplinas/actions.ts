'use server'

import { requireAuth } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addDisciplina(formData: FormData) {
  const { supabase } = await requireAuth()
  const nome = formData.get('nome') as string

  if (!nome) return { error: 'O nome é obrigatório.' }

  const { error } = await supabase.from('disciplinas').insert({ nome })
  
  if (error) {
    return { error: error.message }
  }

  revalidatePath('/provas-si-admin/disciplinas')
  return { success: true }
}

export async function editDisciplina(formData: FormData) {
  const { supabase } = await requireAuth()
  const id = formData.get('id') as string
  const nome = formData.get('nome') as string

  if (!id || !nome) return { error: 'O ID e o nome são obrigatórios.' }

  const { error } = await supabase.from('disciplinas').update({ nome }).eq('id', id)
  
  if (error) {
    return { error: error.message }
  }

  revalidatePath('/provas-si-admin/disciplinas')
  return { success: true }
}

export async function deleteDisciplina(id: string) {
  const { supabase } = await requireAuth()
  const { error } = await supabase.from('disciplinas').delete().eq('id', id)
  
  if (error) {
    return { error: error.message }
  }

  revalidatePath('/provas-si-admin/disciplinas')
  return { success: true }
}
