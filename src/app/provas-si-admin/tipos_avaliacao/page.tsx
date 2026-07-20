import { createClient } from '@/utils/supabase/server'
import { TiposAvaliacaoClient } from './client-page'

export default async function TiposAvaliacaoPage() {
  const supabase = await createClient()
  
  const { data: tipos } = await supabase
    .from('tipos_avaliacao')
    .select('*')
    .order('nome', { ascending: true })

  return (
    <div>
      <TiposAvaliacaoClient tipos={tipos || []} />
    </div>
  )
}
