import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, MapPin } from "lucide-react"
import { Prova } from '@/types'

export function NextExamAlert({ exam }: { exam: Prova | null }) {
  if (!exam) return null

  const dateObj = new Date(exam.data_hora_inicio)
  const formattedDate = dateObj.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo', weekday: 'long', day: '2-digit', month: 'long' })
  const formattedTime = dateObj.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' })

  return (
    <Card className="border-l-4 border-l-secondary shadow-md bg-secondary/5 [--card-spacing:0.5rem]">
      <CardHeader className="pb-0">
        <div className="flex justify-between items-start">
          <div>
            <CardDescription className="text-secondary font-semibold uppercase tracking-wider text-xs mb-1">
              Fique Atento: Próxima Prova
            </CardDescription>
            <CardTitle className="text-xl">{exam.disciplinas?.nome}</CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs">
            {exam.tipo_avaliacao}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-1">
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
          <div className="flex items-center text-xs text-muted-foreground gap-1">
            <CalendarDays className="h-4 w-4 text-secondary" />
            <span className="capitalize">{formattedDate} às {formattedTime}</span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground gap-1">
            <MapPin className="h-3 w-3 text-secondary" />
            <span>Turma: {exam.turmas?.nome}</span>
          </div>
        </div>
        {exam.observacoes && (
          <p className="mt-1 text-[11px] bg-background p-1.5 rounded border text-muted-foreground leading-tight">
            <strong>Obs:</strong> {exam.observacoes}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
