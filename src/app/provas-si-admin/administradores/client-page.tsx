'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { addAdmin, deleteAdmin, editAdmin } from './actions'
import { User } from '@supabase/supabase-js'

export function AdministradoresClient({ users, currentUserId }: { users: User[], currentUserId: string }) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<User | null>(null)

  async function handleAddOrEdit(formData: FormData) {
    setError(null)
    let res;
    if (editingItem) {
      res = await editAdmin(formData)
    } else {
      res = await addAdmin(formData)
    }
    
    if (res?.error) {
      setError(res.error)
    } else {
      setOpen(false)
      setEditingItem(null)
    }
  }

  async function handleDelete(id: string) {
    if (id === currentUserId) {
      alert('Você não pode excluir sua própria conta.')
      return
    }
    if (confirm('Tem certeza que deseja excluir este administrador?')) {
      const res = await deleteAdmin(id)
      if (res?.error) {
        alert(res.error)
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Administradores</h2>
        <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) setEditingItem(null); }}>
          <DialogTrigger render={<Button onClick={() => setEditingItem(null)} />}>
            Novo Administrador
          </DialogTrigger>
          <DialogContent>
            <form action={handleAddOrEdit}>
              <DialogHeader>
                <DialogTitle>{editingItem ? 'Editar Administrador' : 'Adicionar Administrador'}</DialogTitle>
                <DialogDescription>
                  {editingItem ? 'Preencha a senha apenas se quiser alterá-la.' : 'Crie um novo acesso para o painel administrativo.'}
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
                  <Label htmlFor="email" className="text-right">E-mail</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email"
                    placeholder="admin@escola.com" 
                    className="col-span-3" 
                    defaultValue={editingItem?.email || ''} 
                    required={!editingItem}
                    disabled={!!editingItem} // Não vamos permitir mudar o email por simplicidade
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">Senha</Label>
                  <Input 
                    id="password" 
                    name="password" 
                    type="password" 
                    placeholder={editingItem ? 'Deixe em branco para não alterar' : 'Senha forte'} 
                    className="col-span-3" 
                    required={!editingItem} 
                    minLength={6}
                  />
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
              <TableHead>E-mail</TableHead>
              <TableHead>Último Login</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">Nenhum administrador encontrado.</TableCell>
              </TableRow>
            ) : (
              users.map((u) => {
                const isCurrentUser = u.id === currentUserId
                return (
                  <TableRow key={u.id}>
                    <TableCell>
                      {u.email}
                      {isCurrentUser && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                          Você
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleString('pt-BR') : 'Nunca acessou'}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => { setEditingItem(u); setOpen(true); }}>
                        Editar Senha
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDelete(u.id)}
                        disabled={isCurrentUser}
                      >
                        Excluir
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
