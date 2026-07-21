'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Prova } from '@/types'

type ProfessorGroup = {
  id: string
  nome: string
  email?: string
  provas: Prova[]
}

interface ProfessoresBoardProps {
  provas: Prova[]
}

export function ProfessoresBoard({ provas }: ProfessoresBoardProps) {
  // Agrupar provas por professor
  const professorMap = new Map<string, ProfessorGroup>()

  provas.forEach(prova => {
    const profId = prova.disciplinas?.professores?.id
    const profNome = prova.disciplinas?.professores?.nome
    const profEmail = prova.disciplinas?.professores?.email

    if (!profId || !profNome) return // Ignorar provas sem professor

    if (!professorMap.has(profId)) {
      professorMap.set(profId, {
        id: profId,
        nome: profNome,
        email: profEmail,
        provas: []
      })
    }

    professorMap.get(profId)!.provas.push(prova)
  })

  // Converter para array e ordenar alfabeticamente pelo nome do professor
  const professorGroups = Array.from(professorMap.values()).sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))

  // Ordenar as provas dentro de cada professor por data
  professorGroups.forEach(group => {
    group.provas.sort((a, b) => new Date(a.data_hora_inicio).getTime() - new Date(b.data_hora_inicio).getTime())
  })

  if (professorGroups.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          Nenhuma prova agendada para nenhum professor.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg border-2 border-secondary/20 bg-white/95 backdrop-blur-sm">
      <CardContent className="pt-6">
        <Accordion className="w-full space-y-4">
          {professorGroups.map(group => (
            <AccordionItem key={group.id} value={group.id} className="border rounded-lg px-4 bg-muted/10">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex flex-col items-start text-left">
                  <span className="text-lg font-bold text-primary">{group.nome}</span>
                  {group.email && (
                    <span className="text-sm font-medium text-muted-foreground mt-1">
                      {group.email}
                    </span>
                  )}
                  <span className="text-xs font-semibold text-primary/70 mt-2 bg-primary/10 px-2 py-1 rounded-full">
                    {group.provas.length} {group.provas.length === 1 ? 'avaliação' : 'avaliações'}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-6">
                <div className="border rounded-md overflow-x-auto bg-white">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead className="font-bold text-primary whitespace-nowrap">Data</TableHead>
                        <TableHead className="font-bold text-primary">Disciplina</TableHead>
                        <TableHead className="font-bold text-primary">Turma / Período</TableHead>
                        <TableHead className="font-bold text-primary">Tipo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {group.provas.map(p => {
                        const dateObj = new Date(p.data_hora_inicio)
                        const formattedDate = dateObj.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })
                        const formattedTime = dateObj.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' })
                        return (
                          <TableRow key={p.id}>
                            <TableCell className="whitespace-nowrap">
                              <span className="font-semibold text-gray-900">{formattedDate}</span><br />
                              <span className="text-xs font-medium text-muted-foreground">{formattedTime}</span>
                            </TableCell>
                            <TableCell className="font-medium">{p.disciplinas?.nome || '-'}</TableCell>
                            <TableCell>{p.turmas?.nome || '-'}</TableCell>
                            <TableCell>
                              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset bg-secondary/10 text-secondary ring-secondary/20">
                                {p.tipo_avaliacao}
                              </span>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}
