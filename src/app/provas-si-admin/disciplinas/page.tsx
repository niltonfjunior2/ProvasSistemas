import { createClient } from '@/utils/supabase/server'
import { DisciplinasClient } from './client-page'

export default async function DisciplinasPage() {
  const supabase = await createClient()
  const { data: disciplinas } = await supabase.from('disciplinas').select('*, professores(nome), turmas(nome)').order('nome', { ascending: true })
  const { data: professores } = await supabase.from('professores').select('*').order('nome', { ascending: true })
  const { data: turmas } = await supabase.from('turmas').select('*').order('nome', { ascending: true })

  return (
    <div>
      <DisciplinasClient disciplinas={disciplinas || []} professores={professores || []} turmas={turmas || []} />
    </div>
  )
}
