import { createClient } from '@/utils/supabase/server'
import { ExamBoard } from '@/components/ExamBoard'
import { Button } from '@/components/ui/button'
import { FileDown } from 'lucide-react'
import Link from 'next/link'

export const revalidate = 0 // Dynamic page

export default async function PublicHome() {
  const supabase = await createClient()

  // Buscar documentos ativos
  const { data: documentos } = await supabase
    .from('documentos')
    .select('*')
    .eq('ativo', true)
    .order('created_at', { ascending: true })

  // Buscar todas as turmas para o filtro
  const { data: turmas } = await supabase.from('turmas').select('*').order('nome')

  // Buscar todas as provas futuras (a partir de hoje)
  const today = new Date()
  today.setUTCHours(0,0,0,0)

  const { data: rawExams } = await supabase
    .from('provas')
    .select('*, disciplinas(nome, professores(nome)), turmas(nome)')
    .gte('data_hora_inicio', today.toISOString())

  let exams = rawExams || []
  exams.sort((a, b) => {
    // 1. Data da Prova (ascendente)
    if (a.data_hora_inicio !== b.data_hora_inicio) {
      return new Date(a.data_hora_inicio).getTime() - new Date(b.data_hora_inicio).getTime()
    }
    // 2. Turma (alfabética)
    const turmaA = a.turmas?.nome || ''
    const turmaB = b.turmas?.nome || ''
    if (turmaA !== turmaB) {
      return turmaA.localeCompare(turmaB, 'pt-BR')
    }
    // 3. Disciplina (alfabética)
    const discA = a.disciplinas?.nome || ''
    const discB = b.disciplinas?.nome || ''
    return discA.localeCompare(discB, 'pt-BR')
  })

  return (
    <div className="min-h-screen bg-muted/20 pb-12 transition-colors duration-300">
      {/* Header Institucional */}
      <header className="bg-white text-primary py-4 px-4 shadow-md transition-colors duration-300 border-b-4 border-secondary dark:bg-card">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center gap-6">
          <img src="/logosis03.png" alt="Logo Sistemas de Informação UEMG" className="h-16 sm:h-20 w-auto object-contain" />
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-primary">Calendário de Avaliações</h1>
            <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider mt-1">Sistemas de Informação - UEMG Carangola</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-8 space-y-8">
        {/* Alerta da Próxima Prova */}
        {documentos && documentos.length > 0 && (
          <section>
            <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4 mb-4">
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                {documentos.map((doc) => (
                  <Button key={doc.id} render={<a href={doc.url} target="_blank" rel="noopener noreferrer" />} variant="outline" className="w-full sm:w-auto gap-2 border-primary/20 hover:bg-primary/5 text-primary">
                    <FileDown className="h-4 w-4" />
                    {doc.titulo}
                  </Button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Board de Filtros e Listagem */}
        <section>
          <ExamBoard exams={exams || []} turmas={turmas || []} />
        </section>
      </main>
    </div>
  )
}
