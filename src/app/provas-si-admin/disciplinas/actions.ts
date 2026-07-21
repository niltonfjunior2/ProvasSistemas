'use server'

import { requireAuth } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addDisciplina(formData: FormData) {
  const { supabase } = await requireAuth()
  const nome = formData.get('nome') as string
  const professor_id = formData.get('professor_id') as string
  const turma_id = formData.get('turma_id') as string

  if (!nome || !professor_id || !turma_id) return { error: 'O nome, professor e turma são obrigatórios.' }

  const { error } = await supabase.from('disciplinas').insert({ nome, professor_id, turma_id })
  
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
  const professor_id = formData.get('professor_id') as string
  const turma_id = formData.get('turma_id') as string

  if (!id || !nome || !professor_id || !turma_id) return { error: 'O ID, nome, professor e turma são obrigatórios.' }

  const { error } = await supabase.from('disciplinas').update({ nome, professor_id, turma_id }).eq('id', id)
  
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
