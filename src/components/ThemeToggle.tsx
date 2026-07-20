'use client'

import { useTransition, useState } from 'react'
import { Button } from '@/components/ui/button'
import { toggleVedacaoEleitoral } from '@/app/provas-si-admin/actions'
import { toast } from 'sonner'

interface ThemeToggleProps {
  initialState: boolean
}

export function ThemeToggle({ initialState }: ThemeToggleProps) {
  const [isPending, startTransition] = useTransition()
  const [eleitoral, setEleitoral] = useState(initialState)

  const handleToggle = () => {
    const newState = !eleitoral
    setEleitoral(newState)
    
    startTransition(async () => {
      try {
        await toggleVedacaoEleitoral()
        toast.success(`Vedação Eleitoral ${newState ? 'ativada' : 'desativada'} com sucesso!`)
      } catch (error) {
        // Revert on error
        setEleitoral(!newState)
        toast.error('Erro ao alterar a configuração.')
      }
    })
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleToggle}
      disabled={isPending}
      className={
        eleitoral 
          ? 'bg-gray-200 text-gray-900 hover:bg-gray-300 hover:text-black border-transparent' 
          : 'bg-white text-primary hover:bg-gray-100 hover:text-primary border-transparent'
      }
    >
      {isPending ? 'Salvando...' : (eleitoral ? 'Desativar Vedação' : 'Ativar Vedação')}
    </Button>
  )
}
