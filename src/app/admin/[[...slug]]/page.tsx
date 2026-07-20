import { fakeLogin } from './actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function HoneypotPage(props: { searchParams: Promise<{ message: string }> }) {
  const searchParams = await props.searchParams
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-muted/40">
      <Card className="w-full max-w-md shadow-lg border-t-4 border-t-primary">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Acesso Restrito</CardTitle>
          <CardDescription>
            Área administrativa do Calendário de Provas SI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" action={fakeLogin}>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail Institucional</Label>
              <Input id="email" name="email" type="email" placeholder="coordenador@uemg.br" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            {searchParams?.message && (
              <p className="text-sm font-medium text-destructive text-center p-2 bg-destructive/10 rounded-md">
                {searchParams.message}
              </p>
            )}
            <Button className="w-full" type="submit">
              Entrar no Painel
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center border-t p-4 mt-2">
          <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline">
            ← Voltar para a página inicial
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
