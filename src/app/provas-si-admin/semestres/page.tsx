import { createClient } from '@/utils/supabase/server'
import { SemestresClient } from './client-page'

export default async function SemestresPage() {
  const supabase = await createClient()
  const { data: semestres } = await supabase.from('semestres').select('*').order('created_at', { ascending: false })

  return (
    <div>
      <SemestresClient semestres={semestres || []} />
    </div>
  )
}
