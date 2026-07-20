import { requireAuth } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { AdministradoresClient } from './client-page'

export default async function AdministradoresPage() {
  const { user } = await requireAuth()
  
  const supabaseAdmin = createAdminClient()
  const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers()

  if (error) {
    console.error('Erro ao listar administradores:', error)
  }

  // Ordenar para exibir o usuário logado primeiro e depois por data de criação
  const sortedUsers = (users || []).sort((a, b) => {
    if (a.id === user.id) return -1
    if (b.id === user.id) return 1
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  return (
    <div>
      <AdministradoresClient users={sortedUsers} currentUserId={user.id} />
    </div>
  )
}
