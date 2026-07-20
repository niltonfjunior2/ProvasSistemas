'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

import { addTurma, deleteTurma, editTurma } from './actions'
import { Turma, Semestre } from '@/types'

export function TurmasClient({ turmas, semestres }: { turmas: Turma[], semestres: Semestre[] }) {
  const [open, setOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Turma | null>(null)

  async function handleAddOrEdit(formData: FormData) {
    let res;
    if (editingItem) {
      res = await editTurma(formData)
    } else {
      res = await addTurma(formData)
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
      await deleteTurma(id)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Turmas</h2>
        <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) setEditingItem(null); }}>
          <DialogTrigger render={<Button onClick={() => setEditingItem(null)} />}>
            Nova Turma
          </DialogTrigger>
          <DialogContent>
            <form action={handleAddOrEdit}>
              <DialogHeader>
                <DialogTitle>{editingItem ? 'Editar Turma' : 'Adicionar Turma'}</DialogTitle>
                <DialogDescription>
                  {editingItem ? 'Altere o nome da turma ou mude seu semestre letivo.' : 'Vincule a nova turma a um semestre letivo.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {editingItem && <input type="hidden" name="id" value={editingItem.id} />}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nome" className="text-right">Nome</Label>
                  <Input id="nome" name="nome" placeholder="1º Período" className="col-span-3" defaultValue={editingItem?.nome || ''} required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="semestre_nome" className="text-right">Semestre</Label>
                  <div className="col-span-3">
                    <Input id="semestre_nome" name="semestre_nome" placeholder="Ex: 2026-1" defaultValue={editingItem?.semestres?.nome || ''} required />
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
              <TableHead>Nome da Turma</TableHead>
              <TableHead>Semestre</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {turmas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">Nenhuma turma cadastrada.</TableCell>
              </TableRow>
            ) : (
              turmas.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{t.nome}</TableCell>
                  <TableCell>{t.semestres?.nome || '-'}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => { setEditingItem(t); setOpen(true); }}>Editar</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(t.id)}>Excluir</Button>
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
