'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleVedacaoEleitoral() {
  const supabase = await createClient()
  
  // Apenas garantindo que o usuário está autenticado
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Unauthorized')
  }

  // Buscar estado atual
  const { data: config } = await supabase
    .from('configuracoes')
    .select('vedacao_eleitoral')
    .eq('id', '1')
    .single()

  const currentState = config?.vedacao_eleitoral ?? false

  // Inverter o estado
  const { error } = await supabase
    .from('configuracoes')
    .update({ vedacao_eleitoral: !currentState })
    .eq('id', '1')

  if (error) {
    console.error('Failed to toggle vedacao_eleitoral', error)
    throw new Error('Database error')
  }

  // Revalidar o layout root e a página principal para aplicar o novo CSS
  revalidatePath('/', 'layout')
}
