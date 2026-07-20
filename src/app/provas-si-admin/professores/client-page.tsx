'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { addProfessor, deleteProfessor, editProfessor } from './actions'
import { Professor } from '@/types'

export function ProfessoresClient({ professores }: { professores: Professor[] }) {
  const [open, setOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Professor | null>(null)

  async function handleAddOrEdit(formData: FormData) {
    let res;
    if (editingItem) {
      res = await editProfessor(formData)
    } else {
      res = await addProfessor(formData)
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
      await deleteProfessor(id)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Professores</h2>
        <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) setEditingItem(null); }}>
          <DialogTrigger render={<Button onClick={() => setEditingItem(null)} />}>
            Novo Professor
          </DialogTrigger>
          <DialogContent>
            <form action={handleAddOrEdit}>
              <DialogHeader>
                <DialogTitle>{editingItem ? 'Editar Professor' : 'Adicionar Professor'}</DialogTitle>
                <DialogDescription>
                  {editingItem ? 'Atualize os dados do docente.' : 'Insira os dados do docente.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {editingItem && <input type="hidden" name="id" value={editingItem.id} />}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nome" className="text-right">Nome</Label>
                  <Input id="nome" name="nome" placeholder="Dr. João Silva" className="col-span-3" defaultValue={editingItem?.nome || ''} required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">E-mail</Label>
                  <Input id="email" name="email" type="email" placeholder="joao@uemg.br" className="col-span-3" defaultValue={editingItem?.email || ''} />
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
              <TableHead>E-mail</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {professores.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">Nenhum professor cadastrado.</TableCell>
              </TableRow>
            ) : (
              professores.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.nome}</TableCell>
                  <TableCell>{p.email || '-'}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => { setEditingItem(p); setOpen(true); }}>Editar</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(p.id)}>Excluir</Button>
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
