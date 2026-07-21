'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { addDisciplina, deleteDisciplina, editDisciplina } from './actions'
import { Disciplina, Professor, Turma } from '@/types'

export function DisciplinasClient({ disciplinas, professores, turmas }: { disciplinas: Disciplina[], professores: Professor[], turmas: Turma[] }) {
  const [open, setOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Disciplina | null>(null)

  async function handleAddOrEdit(formData: FormData) {
    let res;
    if (editingItem) {
      res = await editDisciplina(formData)
    } else {
      res = await addDisciplina(formData)
    }
    
    if (res?.error) {
      alert(res.error)
    } else {
      setOpen(false)
      setEditingItem(null)
    }
  }

  async function handleDelete(id: string) {
    if (confirm('Tem certeza que deseja excluir?')) {
      await deleteDisciplina(id)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Disciplinas</h2>
        <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) setEditingItem(null); }}>
          <DialogTrigger render={<Button onClick={() => setEditingItem(null)} />}>
            Nova Disciplina
          </DialogTrigger>
          <DialogContent>
            <form action={handleAddOrEdit}>
              <DialogHeader>
                <DialogTitle>{editingItem ? 'Editar Disciplina' : 'Adicionar Disciplina'}</DialogTitle>
                <DialogDescription>
                  {editingItem ? 'Atualize os dados da disciplina.' : 'Insira os dados da disciplina do curso.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {editingItem && <input type="hidden" name="id" value={editingItem.id} />}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nome" className="text-right">Nome</Label>
                  <Input id="nome" name="nome" placeholder="Engenharia de Software" className="col-span-3" defaultValue={editingItem?.nome || ''} required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Professor</Label>
                  <div className="col-span-3">
                    <Select name="professor_id" required defaultValue={editingItem?.professor_id || undefined}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o professor titular">
                          {(val: string) => val ? (professores.find(p => p.id === val)?.nome || val) : "Selecione o professor titular"}
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
              </div>
              <DialogFooter>
                <Button type="submit">Salvar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Turma</TableHead>
              <TableHead>Professor</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {disciplinas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">Nenhuma disciplina cadastrada.</TableCell>
              </TableRow>
            ) : (
              disciplinas.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{d.nome}</TableCell>
                  <TableCell>{d.turmas?.nome || '-'}</TableCell>
                  <TableCell>{d.professores?.nome || '-'}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => { setEditingItem(d); setOpen(true); }}>Editar</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(d.id)}>Excluir</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
