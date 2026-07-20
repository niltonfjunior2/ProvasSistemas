'use server'

import { requireAuth } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addDocumento(formData: FormData) {
  const { supabase } = await requireAuth()
  const titulo = formData.get('titulo') as string
  const url = formData.get('url') as string

  if (!titulo || !url) return { error: 'Título e URL são obrigatórios.' }

  const { error } = await supabase.from('documentos').insert([{ titulo, url, ativo: true }])
  
  if (error) {
    return { error: error.message }
  }

  revalidatePath('/provas-si-admin/documentos')
  revalidatePath('/')
  return { success: true }
}

export async function editDocumento(formData: FormData) {
  const { supabase } = await requireAuth()
  const id = formData.get('id') as string
  const titulo = formData.get('titulo') as string
  const url = formData.get('url') as string

  if (!id || !titulo || !url) return { error: 'ID, Título e URL são obrigatórios.' }

  const { error } = await supabase.from('documentos').update({ titulo, url }).eq('id', id)
  
  if (error) {
    return { error: error.message }
  }

  revalidatePath('/provas-si-admin/documentos')
  revalidatePath('/')
  return { success: true }
}

export async function deleteDocumento(id: string) {
  const { supabase } = await requireAuth()
  const { error } = await supabase.from('documentos').delete().eq('id', id)
  
  if (error) {
    return { error: error.message }
  }

  revalidatePath('/provas-si-admin/documentos')
  revalidatePath('/')
  return { success: true }
}

export async function toggleDocumento(id: string, ativoAtual: boolean) {
  const { supabase } = await requireAuth()
  const { error } = await supabase.from('documentos').update({ ativo: !ativoAtual }).eq('id', id)
  
  if (error) {
    return { error: error.message }
  }

  revalidatePath('/provas-si-admin/documentos')
  revalidatePath('/')
  return { success: true }
}
