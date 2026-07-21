'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { Prova, Turma } from '@/types'
import { NextExamAlert } from '@/components/NextExamAlert'

export function ExamBoard({ exams, turmas }: { exams: Prova[], turmas: Turma[] }) {
  const [search, setSearch] = useState('')
  const [turmaFilter, setTurmaFilter] = useState('todas')
  const [tipoFilter, setTipoFilter] = useState('todos')

  const tiposAvaliacao = useMemo(() => {
    return Array.from(new Set(exams.map(e => e.tipo_avaliacao))).sort()
  }, [exams])

  const filteredExams = useMemo(() => {
    return exams.filter((exam) => {
      const matchSearch = exam.disciplinas?.nome?.toLowerCase().includes(search.toLowerCase()) || 
                          exam.disciplinas?.professores?.nome?.toLowerCase().includes(search.toLowerCase())
      const matchTurma = turmaFilter === 'todas' || exam.turma_id === turmaFilter
      const matchTipo = tipoFilter === 'todos' || exam.tipo_avaliacao === tipoFilter
      return matchSearch && matchTurma && matchTipo
    })
  }, [exams, search, turmaFilter, tipoFilter])

  const nextExam = filteredExams.length > 0 ? filteredExams[0] : null

  return (
    <div className="space-y-6">
      {/* Alerta da Próxima Prova Dinâmico */}
      <section>
        {nextExam ? (
          <NextExamAlert exam={nextExam} />
        ) : (
          <div className="bg-green-50 text-green-800 p-4 rounded-xl border border-green-200 text-center shadow-sm">
            <h3 className="font-bold text-lg">Tudo tranquilo!</h3>
            <p>Não há provas agendadas para os próximos dias com estes filtros.</p>
          </div>
        )}
      </section>

      {/* Filters */}
      <div className="bg-card p-4 rounded-xl shadow-sm border space-y-4">
        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Filtros de Busca</h3>
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar disciplina ou professor..." 
              className="pl-9 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <div className="w-full sm:w-48">
              <Select value={turmaFilter} onValueChange={(val) => setTurmaFilter(val || 'todas')}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as turmas">
                    {turmaFilter === 'todas' ? 'Todas as turmas' : turmas.find(t => t.id === turmaFilter)?.nome}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as turmas</SelectItem>
                  {turmas.map(t => (
                    <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-48">
              <Select value={tipoFilter} onValueChange={(val) => setTipoFilter(val || 'todos')}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos">
                    {tipoFilter === 'todos' ? 'Todos os tipos' : tipoFilter}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os tipos</SelectItem>
                  {tiposAvaliacao.map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              variant="outline" 
              onClick={() => { setSearch(''); setTurmaFilter('todas'); setTipoFilter('todos') }}
              className="w-full sm:w-auto whitespace-nowrap"
            >
              Limpar filtros
            </Button>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Calendário Completo</h3>
        
        {filteredExams.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
            Nenhuma avaliação encontrada com estes filtros.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExams.map((exam) => {
              const dateObj = new Date(exam.data_hora_inicio)
              const formattedDate = dateObj.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo', day: '2-digit', month: '2-digit' })
              const formattedTime = dateObj.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' })
              const hasTime = formattedTime !== '00:00';

              return (
                <Card key={exam.id} className="hover:shadow-md transition-shadow [--card-spacing:0.5rem]">
                  <CardHeader className="pb-0">
                    <div className="flex justify-between items-start gap-2">
                      <CardTitle className="text-base leading-tight line-clamp-2">
                        {exam.disciplinas?.nome}
                      </CardTitle>
                      <div className="text-right flex-shrink-0 leading-tight">
                        <div className="text-base font-bold text-primary">{formattedDate}</div>
                        {hasTime && <div className="text-[11px] text-muted-foreground">{formattedTime}</div>}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-1 text-xs text-muted-foreground">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-foreground">{exam.turmas?.nome}</span>
                      <Badge variant="outline">{exam.tipo_avaliacao}</Badge>
                    </div>
                    <div>Prof. {exam.disciplinas?.professores?.nome || '-'}</div>
                    {exam.observacoes && (
                      <div className="text-[11px] bg-muted p-1.5 mt-1 rounded truncate leading-tight font-bold text-foreground border" title={exam.observacoes}>
                        Obs: {exam.observacoes}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
