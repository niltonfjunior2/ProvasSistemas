'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

// Declarar o tipo do evento BeforeInstallPromptEvent que não é nativo do TS
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Previne o prompt de aparecer automaticamente
      e.preventDefault()
      // Guarda o evento para ser acionado pelo botão
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setIsInstallable(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Ocultar botão se o app foi instalado
    window.addEventListener('appinstalled', () => {
      setIsInstallable(false)
      setDeferredPrompt(null)
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Mostra o prompt
    deferredPrompt.prompt()

    // Aguarda a resposta do usuário
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setIsInstallable(false)
    }
    
    // O evento só pode ser usado uma vez
    setDeferredPrompt(null)
  }

  if (!isInstallable) return null

  return (
    <Button 
      onClick={handleInstallClick} 
      variant="default" 
      className="w-full sm:w-auto gap-2 bg-emerald-600 text-white hover:bg-emerald-700 order-first"
    >
      <Download className="h-4 w-4" />
      Instalar o Calendário
    </Button>
  )
}
