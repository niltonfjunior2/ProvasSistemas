# PROJECT DNA: Calendário de Provas - SI UEMG Carangola

> **Versão:** 2.0 | **Status:** Inicialização / Arquitetura Consolidada
> **Fonte da Verdade:** Este arquivo governa soberanamente todas as decisões de arquitetura, segurança e código.

## 1. MISSION STATEMENT (Visão)
**Role:** Tech Lead Sênior, Arquiteto de Software e Auditor de Segurança deste projeto.
**Objetivo:** Prover um calendário digital centralizado para acesso às datas e detalhes de avaliações do curso de Sistemas de Informação da UEMG Carangola.
**Drivers de Negócio:**
* Custo zero absoluto (Infraestrutura Free Tier).
* Facilidade de acesso para alunos (Mobile-first, acesso anônimo, download de PDF).
* Redução de atrito na comunicação acadêmica.

## 2. RESTRIÇÕES INVIOLÁVEIS & COMPLIANCE (The Hard Box)
* **Infraestrutura:** Deploy obrigatório na Vercel com banco Supabase (Free Tier). Código-fonte no GitHub.
* **Privacidade & LGPD:** Acesso público anônimo para alunos. Nenhuma coleta de PII (Personally Identifiable Information) dos alunos.
* **Segurança (Zero Trust):** Autenticação estrita (Supabase Auth) para coordenadores acessarem o painel administrativo. Validação rigorosa de backend para evitar sobreposição de provas.
* **Manutenibilidade:** Código limpo e modular. UI com suporte a "Vedação Eleitoral" (modo escala de cinza/sem logos).

## 3. CANVAS DE ARQUITETURA PROFUNDA (Decisões Estratégicas)
| Dimensão | Decisão Arquitetural | Justificativa (O Porquê) |
| :--- | :--- | :--- |
| **Escopo / Criticidade** | Foco exclusivo no curso de SI UEMG Carangola | Simplifica o domínio, dados cadastráveis flexibilizam o nome. |
| **Atores / Segurança** | Alunos (Read-only anônimo) e Coordenador (Admin) | Supabase Auth blinda a edição; leitura anônima remove custo LGPD. |
| **Privacidade / Regulação**| Nenhuma coleta de dados de alunos | Reduz custo, elimina risco de vazamento, dispensa cookie banners. |
| **Radar de Linguagens** | Next.js (App Router), React, TailwindCSS | Stack moderna, excelente integração com Vercel, alta produtividade. |
| **Estratégia de Interface**| PWA / Mobile-first, Cores UEMG, Export PDF | Maior engajamento estudantil via atalho; modo offline via PDF. |
| **Persistência de Dados** | Supabase (PostgreSQL) | Suporta relacionamentos complexos (validação de horário). |
| **Perfil Computacional** | Server-side rendering / Static Generation | Rápido carregamento inicial na Vercel (Edge). |
| **Resiliência / Conectividade**| Alertas de rede instável + Exportação de PDF | Contorna complexidade pesada de PWA offline-first nativo. |
| **Acoplamento Externo** | Gerador de PDF via lib Client-side / Server-side | Permite acesso offline confiável do cronograma aos alunos. |
| **Operação / Auditoria** | Vercel Analytics | Mede engajamento/acessos sem custo adicional ou cookies pesados. |

## 4. TECH STACK, VERSÕES & RADAR TECNOLÓGICO
### Core & Linguagens
* **Runtime:** Node 20 LTS
* **Framework:** Next.js 14 (App Router) - Strict Mode
* **Estilização / CSS:** Tailwind CSS v3.x
* **Database / Auth:** Supabase (PostgreSQL)

### Bibliotecas Aprovadas
* **UI / Componentes:** shadcn/ui (Radix UI), Lucide React
* **Validação / Esquemas:** Zod (validação de conflito de datas)
* **Data Fetching:** Supabase-js Client
* **Exportação PDF:** @react-pdf/renderer (ou html2pdf/jsPDF)

## 5. DIRETRIZES DE ENGENHARIA (Security, Privacy & Quality-by-Design)
### 1. Estrutura de Pastas e Isolamento
* `/src/app/(admin)`: Rotas administrativas protegidas pelo Supabase Auth.
* `/src/app/(public)`: Rotas de leitura do calendário (página principal).
* `/src/components`: UI components e layout (ThemeProvider para Vedação Eleitoral).
* `/src/lib`: Conexões com Supabase e utilitários de validação.

### 2. Padrões de Segurança no Código
* Validação rigorosa de sobreposição de horários via Constraints no PostgreSQL (Supabase) ou checagem no backend (Server Actions) antes da inserção.
* RLS (Row Level Security) ativado no Supabase: Leitura pública habilitada para provas agendadas; Escrita totalmente restrita ao perfil autenticado (Auth) do Coordenador.

### 3. Padrões de Refatoração Proativa
* Abstrair lógica do Theme (Cores UEMG vs Vedação Eleitoral em escala de cinza) utilizando variáveis CSS globais e um Context/Provider único.
