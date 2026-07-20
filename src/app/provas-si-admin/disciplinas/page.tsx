import { createClient } from '@/utils/supabase/server'
import { DisciplinasClient } from './client-page'

export default async function DisciplinasPage() {
  const supabase = await createClient()
  const { data: disciplinas } = await supabase.from('disciplinas').select('*').order('nome', { ascending: true })

  return (
    <div>
      <DisciplinasClient disciplinas={disciplinas || []} />
    </div>
  )
}
