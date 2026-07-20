'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { addSemestre, deleteSemestre } from './actions'
import { Semestre } from '@/types'

export function SemestresClient({ semestres }: { semestres: Semestre[] }) {
  const [open, setOpen] = useState(false)

  async function handleAdd(formData: FormData) {
    const res = await addSemestre(formData)
    if (res?.error) {
      alert(res.error)
    } else {
      setOpen(false)
    }
  }

  async function handleDelete(id: string) {
    if (confirm('Tem certeza que deseja excluir?')) {
      await deleteSemestre(id)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Semestres</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button />}>
            Novo Semestre
          </DialogTrigger>
          <DialogContent>
            <form action={handleAdd}>
              <DialogHeader>
                <DialogTitle>Adicionar Semestre</DialogTitle>
                <DialogDescription>
                  Insira o nome do período letivo (ex: 2026/1).
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nome" className="text-right">Nome</Label>
                  <Input id="nome" name="nome" placeholder="2026/1" className="col-span-3" required />
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
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {semestres.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">Nenhum semestre cadastrado.</TableCell>
              </TableRow>
            ) : (
              semestres.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.nome}</TableCell>
                  <TableCell>{s.ativo ? 'Ativo' : 'Inativo'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(s.id)}>Excluir</Button>
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
