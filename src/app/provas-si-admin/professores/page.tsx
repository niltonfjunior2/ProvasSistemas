import { createClient } from '@/utils/supabase/server'
import { ProfessoresClient } from './client-page'

export default async function ProfessoresPage() {
  const supabase = await createClient()
  const { data: professores } = await supabase.from('professores').select('*').order('nome', { ascending: true })

  return (
    <div>
      <ProfessoresClient professores={professores || []} />
    </div>
  )
}
