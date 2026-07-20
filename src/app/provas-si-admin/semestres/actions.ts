'use server'

import { requireAuth } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addSemestre(formData: FormData) {
  const { supabase } = await requireAuth()
  const nome = formData.get('nome') as string

  if (!nome) return { error: 'O nome é obrigatório.' }

  const { error } = await supabase.from('semestres').insert({ nome, ativo: true })
  
  if (error) {
    return { error: error.message }
  }

  revalidatePath('/provas-si-admin/semestres')
  return { success: true }
}

export async function deleteSemestre(id: string) {
  const { supabase } = await requireAuth()
  const { error } = await supabase.from('semestres').delete().eq('id', id)
  
  if (error) {
    return { error: error.message }
  }

  revalidatePath('/provas-si-admin/semestres')
  return { success: true }
}
