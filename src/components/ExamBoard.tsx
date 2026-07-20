'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search } from 'lucide-react'
import { Prova, Turma } from '@/types'

export function ExamBoard({ exams, turmas }: { exams: Prova[], turmas: Turma[] }) {
  const [search, setSearch] = useState('')
  const [turmaFilter, setTurmaFilter] = useState('todas')

  const filteredExams = useMemo(() => {
    return exams.filter((exam) => {
      const matchSearch = exam.disciplinas?.nome?.toLowerCase().includes(search.toLowerCase()) || 
                          exam.professores?.nome?.toLowerCase().includes(search.toLowerCase())
      const matchTurma = turmaFilter === 'todas' || exam.turma_id === turmaFilter
      return matchSearch && matchTurma
    })
  }, [exams, search, turmaFilter])

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-card p-4 rounded-xl shadow-sm border space-y-4">
        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Filtros de Busca</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar disciplina ou professor..." 
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={turmaFilter} onValueChange={setTurmaFilter}>
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
              const formattedDate = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
              const formattedTime = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

              return (
                <Card key={exam.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start gap-2">
                      <CardTitle className="text-lg leading-tight line-clamp-2">
                        {exam.disciplinas?.nome}
                      </CardTitle>
                      <div className="text-right flex-shrink-0">
                        <div className="text-lg font-bold text-primary">{formattedDate}</div>
                        <div className="text-xs text-muted-foreground">{formattedTime}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2 text-sm text-muted-foreground space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-foreground">{exam.turmas?.nome}</span>
                      <Badge variant="outline">{exam.tipo_avaliacao}</Badge>
                    </div>
                    <div>Prof. {exam.professores?.nome}</div>
                    {exam.observacoes && (
                      <div className="text-xs bg-muted/50 p-2 rounded truncate" title={exam.observacoes}>
                        {exam.observacoes}
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
