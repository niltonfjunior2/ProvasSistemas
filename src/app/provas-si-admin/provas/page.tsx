import { createClient } from '@/utils/supabase/server'
import { ProvasClient } from './client-page'

export default async function ProvasPage() {
  const supabase = await createClient()
  
  // Fetch everything needed
  const [
    { data: provas },
    { data: disciplinas },
    { data: professores },
    { data: turmas },
    { data: tiposAvaliacao }
  ] = await Promise.all([
    supabase.from('provas').select('*, turmas(nome), disciplinas(nome), professores(nome)').order('data_hora_inicio', { ascending: true }),
    supabase.from('disciplinas').select('*').order('nome', { ascending: true }),
    supabase.from('professores').select('*').order('nome', { ascending: true }),
    supabase.from('turmas').select('*').order('nome', { ascending: true }),
    supabase.from('tipos_avaliacao').select('*').order('nome', { ascending: true })
  ])

  return (
    <div>
      <ProvasClient 
        provas={provas || []} 
        disciplinas={disciplinas || []} 
        professores={professores || []} 
        turmas={turmas || []} 
        tiposAvaliacao={tiposAvaliacao || []}
      />
    </div>
  )
}
