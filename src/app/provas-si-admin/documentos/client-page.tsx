'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { addDocumento, deleteDocumento, toggleDocumento, editDocumento } from './actions'
import { Documento } from '@/types'

export function DocumentosClient({ documentos }: { documentos: Documento[] }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editingItem, setEditingItem] = useState<Documento | null>(null)

  async function handleAddOrEdit(formData: FormData) {
    setLoading(true)
    let result;
    if (editingItem) {
      result = await editDocumento(formData)
    } else {
      result = await addDocumento(formData)
    }
    setLoading(false)
    if (result?.error) {
      alert(result.error)
    } else {
      setOpen(false)
      setEditingItem(null)
    }
  }

  async function handleDelete(id: string) {
    if (confirm('Tem certeza que deseja remover este link?')) {
      await deleteDocumento(id)
    }
  }

  async function handleToggle(id: string, ativoAtual: boolean) {
    await toggleDocumento(id, ativoAtual)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Links Cadastrados</h2>
        
        <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) setEditingItem(null); }}>
          <DialogTrigger render={<Button onClick={() => setEditingItem(null)} />}>
            Novo Documento
          </DialogTrigger>
          <DialogContent>
            <form action={handleAddOrEdit}>
              <DialogHeader>
                <DialogTitle>{editingItem ? 'Editar Documento / Link' : 'Novo Documento / Link'}</DialogTitle>
                <DialogDescription>
                  {editingItem ? 'Edite o link do documento selecionado.' : 'Adicione um link para PDF, pasta do Drive ou aviso. Ele aparecerá no painel do aluno.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {editingItem && <input type="hidden" name="id" value={editingItem.id} />}
                <div className="grid gap-2">
                  <Label htmlFor="titulo">Título (ex: Cronograma PDF)</Label>
                  <Input id="titulo" name="titulo" defaultValue={editingItem?.titulo || ''} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="url">URL do Link</Label>
                  <Input id="url" name="url" type="url" placeholder="https://..." defaultValue={editingItem?.url || ''} required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Visível (Ativo)</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documentos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  Nenhum link cadastrado.
                </TableCell>
              </TableRow>
            ) : (
              documentos.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.titulo}</TableCell>
                  <TableCell className="text-muted-foreground truncate max-w-[200px]" title={doc.url}>
                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {doc.url}
                    </a>
                  </TableCell>
                  <TableCell>
                    <Switch 
                      checked={doc.ativo} 
                      onCheckedChange={() => handleToggle(doc.id, doc.ativo)} 
                    />
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => { setEditingItem(doc); setOpen(true); }}>
                      Editar
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(doc.id)}>
                      Remover
                    </Button>
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
