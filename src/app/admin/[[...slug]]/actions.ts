'use server'

import { redirect } from 'next/navigation'

export async function fakeLogin(formData: FormData) {
  // Simula um atraso de processamento real (útil para honeypots)
  await new Promise(r => setTimeout(r, 1500))
  
  // Você também poderia salvar a tentativa no banco de dados aqui (logging de IP seria interessante se tivéssemos acesso ao request origin)
  console.warn('Tentativa de acesso bloqueada pelo Honeypot')

  redirect('/admin?message=Não foi possível autenticar. Verifique suas credenciais.')
}
