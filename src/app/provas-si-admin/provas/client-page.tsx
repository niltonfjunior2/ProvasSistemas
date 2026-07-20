'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { addProva, deleteProva, editProva } from './actions'
import { Prova, Disciplina, Professor, Turma, TipoAvaliacao } from '@/types'

export function ProvasClient({ provas, disciplinas, professores, turmas, tiposAvaliacao }: { provas: Prova[], disciplinas: Disciplina[], professores: Professor[], turmas: Turma[], tiposAvaliacao: TipoAvaliacao[] }) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<Prova | null>(null)

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
                  {editingItem ? 'Edite os dados da prova. O sistema validará se a nova data gera conflito.' : 'Preencha os dados da prova. O sistema não permitirá choque de datas para a mesma turma.'}
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
                    <Select name="turma_id" required defaultValue={editingItem?.turma_id || undefined}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a turma">
                          {(val: string) => val ? (turmas.find(t => t.id === val)?.nome || val) : "Selecione a turma"}
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
                    <Select name="disciplina_id" required defaultValue={editingItem?.disciplina_id || undefined}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a disciplina">
                          {(val: string) => val ? (disciplinas.find(d => d.id === val)?.nome || val) : "Selecione a disciplina"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {disciplinas.map(d => (
                          <SelectItem key={d.id} value={d.id}>{d.nome}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Professor</Label>
                  <div className="col-span-3">
                    <Select name="professor_id" required defaultValue={editingItem?.professor_id || undefined}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o professor">
                          {(val: string) => val ? (professores.find(p => p.id === val)?.nome || val) : "Selecione o professor"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {professores.map(p => (
                          <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>
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
                  <Input id="data_hora_inicio" name="data_hora_inicio" type="datetime-local" className="col-span-3" defaultValue={editingItem ? new Date(new Date(editingItem.data_hora_inicio).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0,16) : ''} required />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="observacoes" className="text-right">Observações</Label>
                  <Input id="observacoes" name="observacoes" placeholder="Ex: Laboratório 1" className="col-span-3" defaultValue={editingItem?.observacoes || ''} />
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
                const formattedDate = dateObj.toLocaleDateString('pt-BR')
                const formattedTime = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                
                return (
                  <TableRow key={p.id}>
                    <TableCell>
                      <span className="font-semibold">{formattedDate}</span><br/>
                      <span className="text-xs text-muted-foreground">{formattedTime}</span>
                    </TableCell>
                    <TableCell>{p.turmas?.nome || '-'}</TableCell>
                    <TableCell>{p.disciplinas?.nome || '-'}</TableCell>
                    <TableCell>{p.professores?.nome || '-'}</TableCell>
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
