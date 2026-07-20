import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, MapPin } from "lucide-react"
import { Prova } from '@/types'

export function NextExamAlert({ exam }: { exam: Prova | null }) {
  if (!exam) return null

  const dateObj = new Date(exam.data_hora_inicio)
  const formattedDate = dateObj.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })
  const formattedTime = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

  return (
    <Card className="border-l-4 border-l-secondary shadow-md bg-secondary/5">
      <CardHeader className="pb-2">
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
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <div className="flex items-center text-sm text-muted-foreground gap-2">
            <CalendarDays className="h-4 w-4 text-secondary" />
            <span className="capitalize">{formattedDate} às {formattedTime}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground gap-2">
            <MapPin className="h-4 w-4 text-secondary" />
            <span>Turma: {exam.turmas?.nome}</span>
          </div>
        </div>
        {exam.observacoes && (
          <p className="mt-4 text-sm bg-background p-2 rounded-md border text-muted-foreground">
            <strong>Obs:</strong> {exam.observacoes}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
