'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { addProva, deleteProva, editProva } from './actions'
import { Prova, Disciplina, Professor, Turma, TipoAvaliacao } from '@/types'

export function ProvasClient({ provas, disciplinas, turmas, tiposAvaliacao }: { provas: Prova[], disciplinas: Disciplina[], turmas: Turma[], tiposAvaliacao: TipoAvaliacao[] }) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<Prova | null>(null)
  const [selectedTurmaId, setSelectedTurmaId] = useState<string>('')
  const [selectedDisciplinaId, setSelectedDisciplinaId] = useState<string>('')

  useEffect(() => {
    if (editingItem) {
      setSelectedTurmaId(editingItem.turma_id)
      setSelectedDisciplinaId(editingItem.disciplina_id)
    } else {
      setSelectedTurmaId('')
      setSelectedDisciplinaId('')
    }
  }, [editingItem])

  async function handleAddOrEdit(formData: FormData) {
    setError(null)
    let res;
    if (editingItem) {
      res = await editProva(formData)
    } else {
      res = await addProva(formData)
    }
    if (res?.error) {
      setError(res.error)
    } else {
      if (res?.warning) {
        alert(res.warning)
      }
      setOpen(false)
      setEditingItem(null)
    }
  }

  async function handleDelete(id: string) {
    if (confirm('Tem certeza que deseja cancelar esta prova?')) {
      await deleteProva(id)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Agendamento de Provas</h2>
        <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) setEditingItem(null); }}>
          <DialogTrigger render={<Button onClick={() => setEditingItem(null)} />}>
            Agendar Nova Prova
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <form action={handleAddOrEdit}>
              <DialogHeader>
                <DialogTitle>{editingItem ? 'Editar Avaliação' : 'Agendar Avaliação'}</DialogTitle>
                <DialogDescription>
                  {editingItem ? 'Edite os dados da prova. O sistema emitirá um alerta caso a nova data gere conflito.' : 'Preencha os dados da prova. O sistema emitirá um alerta caso já exista avaliação para a turma nesta data.'}
                </DialogDescription>
              </DialogHeader>

              {error && (
                <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm mt-2">
                  {error}
                </div>
              )}

              <div className="grid gap-4 py-4">
                {editingItem && <input type="hidden" name="id" value={editingItem.id} />}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Turma</Label>
                  <div className="col-span-3">
                    <Select name="turma_id" required value={selectedTurmaId || undefined} onValueChange={(val) => { setSelectedTurmaId(val || ''); setSelectedDisciplinaId(''); }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a turma">
                          {selectedTurmaId ? turmas.find(t => t.id === selectedTurmaId)?.nome : undefined}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {turmas.map(t => (
                          <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Disciplina</Label>
                  <div className="col-span-3">
                    <Select name="disciplina_id" required value={selectedDisciplinaId || undefined} onValueChange={(val) => setSelectedDisciplinaId(val || '')} disabled={!selectedTurmaId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a disciplina">
                          {selectedDisciplinaId ? disciplinas.find(d => d.id === selectedDisciplinaId)?.nome : undefined}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {disciplinas.filter(d => d.turma_id === selectedTurmaId).map(d => (
                          <SelectItem key={d.id} value={d.id}>{d.nome}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Tipo</Label>
                  <div className="col-span-3">
                    <Select name="tipo_avaliacao" required defaultValue={editingItem?.tipo_avaliacao || undefined}>
                      <SelectTrigger><SelectValue placeholder="Tipo de Avaliação" /></SelectTrigger>
                      <SelectContent>
                        {tiposAvaliacao.map(t => (
                          <SelectItem key={t.id} value={t.nome}>{t.nome}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="data_hora_inicio" className="text-right">Data/Hora</Label>
                  <Input id="data_hora_inicio" name="data_hora_inicio" type="datetime-local" className="col-span-3" defaultValue={editingItem ? new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(editingItem.data_hora_inicio)).replace(' ', 'T') : ''} required />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="observacoes" className="text-right">Observações</Label>
                  <Input id="observacoes" name="observacoes" placeholder="Ex: EaD" className="col-span-3" defaultValue={editingItem?.observacoes || ''} />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full sm:w-auto">Confirmar Agendamento</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Turma</TableHead>
              <TableHead>Disciplina</TableHead>
              <TableHead>Professor</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {provas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">Nenhuma prova agendada.</TableCell>
              </TableRow>
            ) : (
              provas.map((p) => {
                const dateObj = new Date(p.data_hora_inicio)
                const formattedDate = dateObj.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })
                const formattedTime = dateObj.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' })

                return (
                  <TableRow key={p.id}>
                    <TableCell>
                      <span className="font-semibold">{formattedDate}</span><br />
                      <span className="text-xs text-muted-foreground">{formattedTime}</span>
                    </TableCell>
                    <TableCell>{p.turmas?.nome || '-'}</TableCell>
                    <TableCell>{p.disciplinas?.nome || '-'}</TableCell>
                    <TableCell>{p.disciplinas?.professores?.nome || '-'}</TableCell>
                    <TableCell>{p.tipo_avaliacao}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset bg-blue-50 text-blue-700 ring-blue-700/10">
                        {p.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => { setEditingItem(p); setOpen(true); }}>
                        Editar
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(p.id)} className="text-destructive">
                        Cancelar
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
