'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { addTipoAvaliacao, deleteTipoAvaliacao, editTipoAvaliacao } from './actions'
import { TipoAvaliacao } from '@/types'

export function TiposAvaliacaoClient({ tipos }: { tipos: TipoAvaliacao[] }) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<TipoAvaliacao | null>(null)

  async function handleAddOrEdit(formData: FormData) {
    setError(null)
    let res;
    if (editingItem) {
      res = await editTipoAvaliacao(formData)
    } else {
      res = await addTipoAvaliacao(formData)
    }
    if (res?.error) {
      setError(res.error)
    } else {
      setOpen(false)
      setEditingItem(null)
    }
  }

  async function handleDelete(id: string) {
    if (confirm('Tem certeza que deseja excluir? Isso não afetará provas antigas, pois elas mantêm apenas o nome em histórico.')) {
      await deleteTipoAvaliacao(id)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tipos de Avaliação</h2>
        <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) setEditingItem(null); }}>
          <DialogTrigger render={<Button onClick={() => setEditingItem(null)} />}>
            Novo Tipo
          </DialogTrigger>
          <DialogContent>
            <form action={handleAddOrEdit}>
              <DialogHeader>
                <DialogTitle>{editingItem ? 'Editar Tipo de Avaliação' : 'Adicionar Tipo de Avaliação'}</DialogTitle>
                <DialogDescription>
                  {editingItem ? 'Atualize o nome deste tipo de avaliação.' : 'Crie novas opções que aparecerão no menu na hora de agendar uma prova.'}
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
                  <Label htmlFor="nome" className="text-right">Nome</Label>
                  <Input id="nome" name="nome" placeholder="Ex: Prova Substitutiva" className="col-span-3" defaultValue={editingItem?.nome || ''} required />
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
              <TableHead>Nome do Tipo</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tipos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center">Nenhum tipo cadastrado.</TableCell>
              </TableRow>
            ) : (
              tipos.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.nome}</TableCell>
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
