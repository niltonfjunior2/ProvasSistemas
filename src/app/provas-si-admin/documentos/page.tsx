import { createClient } from '@/utils/supabase/server'
import { DocumentosClient } from './client-page'

export const revalidate = 0 // Opt out of caching

export default async function DocumentosPage() {
  const supabase = await createClient()
  
  const { data: documentos, error } = await supabase
    .from('documentos')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return <div>Erro ao carregar documentos: {error.message}</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Documentos & Links</h1>
        <p className="text-muted-foreground">Gerencie os links exibidos na tela principal para os alunos.</p>
      </div>
      
      <DocumentosClient documentos={documentos || []} />
    </div>
  )
}
