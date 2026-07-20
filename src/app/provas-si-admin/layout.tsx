import { createClient } from '@/utils/supabase/server'
import { ThemeToggle } from '@/components/ThemeToggle'
import Link from 'next/link'
import { signout } from '@/app/provas-si-admin/login/actions'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <>{children}</>
  }

  // Buscar estado atual da vedação eleitoral
  const { data: config } = await supabase
    .from('configuracoes')
    .select('vedacao_eleitoral')
    .eq('id', '1')
    .single()
    
  const isEleitoral = config?.vedacao_eleitoral ?? false

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="bg-primary text-primary-foreground p-4 shadow-md flex justify-between items-center flex-wrap gap-4">
        <Link href="/provas-si-admin" className="hover:opacity-80 transition-opacity">
          <h1 className="text-xl font-bold">Painel Administrativo - SI UEMG</h1>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle initialState={isEleitoral} />
          <span className="text-sm hidden sm:inline">{user.email}</span>
          <form action={signout}>
            <button type="submit" className="text-sm underline hover:text-white/80">Sair</button>
          </form>
        </div>
      </header>
      <main className="p-6 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  )
}
