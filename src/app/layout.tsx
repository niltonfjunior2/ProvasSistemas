import type { Metadata } from "next";
import { Outfit, Geist_Mono } from "next/font/google";
import "./globals.css";
import { createClient } from '@/utils/supabase/server'

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Calendário de Provas - SI UEMG",
  description: "Sistema institucional de consulta ao calendário de avaliações",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: config } = await supabase
    .from('configuracoes')
    .select('vedacao_eleitoral')
    .eq('id', '1')
    .single();

  const isEleitoral = config?.vedacao_eleitoral === true;

  return (
    <html
      lang="pt-BR"
      className={`${outfit.variable} ${geistMono.variable} h-full antialiased ${isEleitoral ? 'theme-eleitoral' : ''}`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
