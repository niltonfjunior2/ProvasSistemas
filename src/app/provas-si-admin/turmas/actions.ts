'use server'

import { requireAuth } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addTurma(formData: FormData) {
  const { supabase } = await requireAuth()
  const nome = formData.get('nome') as string
  const semestre_nome = formData.get('semestre_nome') as string

  if (!nome || !semestre_nome) return { error: 'O nome e o semestre são obrigatórios.' }

  let { data: semestre } = await supabase.from('semestres').select('id').eq('nome', semestre_nome).maybeSingle()

  let semestre_id = semestre?.id

  if (!semestre_id) {
    const { data: newSemestre, error: createError } = await supabase
      .from('semestres')
      .insert({ nome: semestre_nome, ativo: true })
      .select('id')
      .single()
      
    if (createError) return { error: 'Erro ao criar o semestre: ' + createError.message }
    semestre_id = newSemestre.id
  }

  const { error } = await supabase.from('turmas').insert({ nome, semestre_id })
  
  if (error) {
    return { error: error.message }
  }

  revalidatePath('/provas-si-admin/turmas')
  return { success: true }
}

export async function editTurma(formData: FormData) {
  const { supabase } = await requireAuth()
  const id = formData.get('id') as string
  const nome = formData.get('nome') as string
  const semestre_nome = formData.get('semestre_nome') as string

  if (!id || !nome || !semestre_nome) return { error: 'ID, nome e semestre são obrigatórios.' }

  let { data: semestre } = await supabase.from('semestres').select('id').eq('nome', semestre_nome).maybeSingle()

  let semestre_id = semestre?.id

  if (!semestre_id) {
    const { data: newSemestre, error: createError } = await supabase
      .from('semestres')
      .insert({ nome: semestre_nome, ativo: true })
      .select('id')
      .single()
      
    if (createError) return { error: 'Erro ao criar o semestre: ' + createError.message }
    semestre_id = newSemestre.id
  }

  const { error } = await supabase.from('turmas').update({ nome, semestre_id }).eq('id', id)
  
  if (error) {
    return { error: error.message }
  }

  revalidatePath('/provas-si-admin/turmas')
  return { success: true }
}

export async function deleteTurma(id: string) {
  const { supabase } = await requireAuth()
  const { error } = await supabase.from('turmas').delete().eq('id', id)
  
  if (error) {
    return { error: error.message }
  }

  revalidatePath('/provas-si-admin/turmas')
  return { success: true }
}
