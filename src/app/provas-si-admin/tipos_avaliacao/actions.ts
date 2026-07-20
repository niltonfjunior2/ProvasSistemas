'use server'

import { requireAuth } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addTipoAvaliacao(formData: FormData) {
  const { supabase } = await requireAuth()
  const nome = formData.get('nome') as string

  if (!nome) return { error: 'O nome é obrigatório.' }

  const { error } = await supabase.from('tipos_avaliacao').insert({ nome })
  
  if (error) {
    if (error.code === '23505') {
      return { error: 'Este tipo de avaliação já existe.' }
    }
    return { error: error.message }
  }

  revalidatePath('/provas-si-admin/tipos_avaliacao')
  return { success: true }
}

export async function editTipoAvaliacao(formData: FormData) {
  const { supabase } = await requireAuth()
  const id = formData.get('id') as string
  const nome = formData.get('nome') as string

  if (!id || !nome) return { error: 'O ID e o nome são obrigatórios.' }

  const { error } = await supabase.from('tipos_avaliacao').update({ nome }).eq('id', id)
  
  if (error) {
    if (error.code === '23505') {
      return { error: 'Este tipo de avaliação já existe.' }
    }
    return { error: error.message }
  }

  revalidatePath('/provas-si-admin/tipos_avaliacao')
  return { success: true }
}

export async function deleteTipoAvaliacao(id: string) {
  const { supabase } = await requireAuth()
  const { error } = await supabase.from('tipos_avaliacao').delete().eq('id', id)
  
  if (error) {
    return { error: error.message }
  }

  revalidatePath('/provas-si-admin/tipos_avaliacao')
  return { success: true }
}
