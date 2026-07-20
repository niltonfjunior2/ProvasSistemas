import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Visão Geral</h2>
        <p className="text-muted-foreground">
          Gerencie as provas, disciplinas e professores do curso.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/provas-si-admin/turmas">
          <Card className="hover:border-primary hover:shadow-md transition-all cursor-pointer h-full">
            <CardHeader>
              <CardTitle>Turmas & Semestres</CardTitle>
              <CardDescription>Estrutura dos períodos letivos</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/provas-si-admin/disciplinas">
          <Card className="hover:border-primary hover:shadow-md transition-all cursor-pointer h-full">
            <CardHeader>
              <CardTitle>Disciplinas</CardTitle>
              <CardDescription>Cadastro de disciplinas do curso</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/provas-si-admin/professores">
          <Card className="hover:border-primary hover:shadow-md transition-all cursor-pointer h-full">
            <CardHeader>
              <CardTitle>Professores</CardTitle>
              <CardDescription>Gerenciar corpo docente</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/provas-si-admin/tipos_avaliacao">
          <Card className="hover:border-primary hover:shadow-md transition-all cursor-pointer h-full">
            <CardHeader>
              <CardTitle>Tipos de Avaliação</CardTitle>
              <CardDescription>Gerenciar os tipos de provas</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/provas-si-admin/provas">
          <Card className="hover:border-primary hover:shadow-md transition-all cursor-pointer h-full">
            <CardHeader>
              <CardTitle>Provas</CardTitle>
              <CardDescription>Gerencie o calendário de avaliações</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        
        <Link href="/provas-si-admin/documentos">
          <Card className="hover:border-primary hover:shadow-md transition-all cursor-pointer h-full">
            <CardHeader>
              <CardTitle>Documentos & Links</CardTitle>
              <CardDescription>Gerencie arquivos (PDF) na tela dos alunos</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/provas-si-admin/administradores">
          <Card className="hover:border-primary hover:shadow-md transition-all cursor-pointer h-full">
            <CardHeader>
              <CardTitle>Administradores</CardTitle>
              <CardDescription>Gerencie os usuários de acesso ao painel</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  )
}
