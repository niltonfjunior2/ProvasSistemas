import { createClient } from '@/utils/supabase/server'
import { NextExamAlert } from '@/components/NextExamAlert'
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

  const { data: exams } = await supabase
    .from('provas')
    .select('*, disciplinas(nome), professores(nome), turmas(nome)')
    .gte('data_hora_inicio', today.toISOString())
    .order('data_hora_inicio', { ascending: true })

  const nextExam = exams && exams.length > 0 ? exams[0] : null

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
        <section>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h2 className="text-xl font-bold">Quadro de Avisos</h2>
            {documentos && documentos.length > 0 && (
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                {documentos.map((doc) => (
                  <Button key={doc.id} render={<a href={doc.url} target="_blank" rel="noopener noreferrer" />} variant="outline" className="w-full sm:w-auto gap-2 border-primary/20 hover:bg-primary/5 text-primary">
                    <FileDown className="h-4 w-4" />
                    {doc.titulo}
                  </Button>
                ))}
              </div>
            )}
          </div>
          {nextExam ? (
            <NextExamAlert exam={nextExam} />
          ) : (
            <div className="bg-green-50 text-green-800 p-4 rounded-xl border border-green-200 text-center shadow-sm">
              <h3 className="font-bold text-lg">Tudo tranquilo!</h3>
              <p>Não há provas agendadas para os próximos dias.</p>
            </div>
          )}
        </section>

        {/* Board de Filtros e Listagem */}
        <section>
          <ExamBoard exams={exams || []} turmas={turmas || []} />
        </section>
      </main>
    </div>
  )
}
