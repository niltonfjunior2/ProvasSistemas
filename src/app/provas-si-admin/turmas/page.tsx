import { createClient } from '@/utils/supabase/server'
import { TurmasClient } from './client-page'

export default async function TurmasPage() {
  const supabase = await createClient()
  
  // Busca turmas com o nome do semestre associado
  const { data: turmas } = await supabase.from('turmas').select('*, semestres(nome)').order('nome', { ascending: true })
  
  // Busca semestres para o formulário de cadastro (apenas ativos)
  const { data: semestres } = await supabase.from('semestres').select('*').eq('ativo', true).order('nome', { ascending: false })

  return (
    <div>
      <TurmasClient turmas={turmas || []} semestres={semestres || []} />
    </div>
  )
}
