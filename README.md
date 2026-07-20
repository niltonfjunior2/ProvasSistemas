# Calendário de Avaliações - Sistemas de Informação (UEMG Carangola)

Sistema institucional voltado para a organização, divulgação e consulta das datas de provas e avaliações do curso de Sistemas de Informação da UEMG (Unidade Carangola).

Este projeto visa resolver problemas de comunicação em relação às datas de provas (choques de horário entre disciplinas e esquecimentos), oferecendo uma plataforma moderna, *mobile-first* e de fácil navegação tanto para os alunos quanto para a coordenação.

---

## 🚀 Principais Funcionalidades

### 🎓 Para os Alunos (Visão Pública)
* **Calendário Dinâmico:** Visualização limpa e direta de todas as provas futuras.
* **Alertas Inteligentes:** O sistema exibe um alerta de "Próxima Prova" em destaque para manter os alunos informados sobre qual é a avaliação mais urgente.
* **Filtros Avançados:** Busca textual e filtros por turmas específicas.
* **Quadro de Avisos/Documentos:** Espaço para download de documentos e PDFs institucionais fixados pela coordenação.
* **Identidade Visual Dinâmica:** O sistema adapta as cores para tons de cinza automaticamente durante o período de vedação eleitoral (configurável pelo painel).

### ⚙️ Para a Coordenação (Área Administrativa)
* **Segurança Reforçada:** Acesso administrativo protegido e monitorado contra tentativas de força-bruta.
* **Gestão de Cadastros (CRUD):** 
  * Controle de Semestres Letivos.
  * Cadastro de Turmas, Disciplinas e Professores.
  * Cadastro de Documentos em nuvem.
  * Flexibilidade na criação de Tipos de Avaliação ("1ª Avaliação", "Exame Final", etc).
* **Gerenciamento de Provas:** Painel central para agendar, modificar e excluir avaliações da grade.
* **Painel Multi-admin:** Permite o controle de administradores, exigindo sempre pelo menos um administrador ativo no sistema.

---

## 🛠️ Tecnologias Utilizadas

O sistema adota uma arquitetura Serverless *cutting-edge*, focando em zero custo fixo, altíssima escalabilidade e forte tipagem:

* **Framework:** [Next.js (App Router)](https://nextjs.org/) + React 19
* **Linguagem:** TypeScript
* **Estilização:** Tailwind CSS v4 + [Shadcn/ui](https://ui.shadcn.com/)
* **Tipografia:** Fonte Outfit (via `next/font`)
* **Banco de Dados & Autenticação:** [Supabase](https://supabase.com/) (PostgreSQL + RLS Auth)
* **Validação de Dados:** Zod

---

## 💻 Como Rodar Localmente

### Pré-requisitos
* Node.js (v18+)
* Uma conta/projeto no Supabase

### Passos para Instalação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/niltonfjunior2/ProvasSistemas.git
   cd ProvasSistemas
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env.local` na raiz do projeto e insira as credenciais da API do Supabase (Atenção: A chave de conexão `postgresql://` não fica no projeto, apenas as chaves da API).
   ```env
   NEXT_PUBLIC_SUPABASE_URL=sua-url-do-supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-publica
   SUPABASE_SERVICE_ROLE_KEY=sua-chave-secreta-service-role
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

5. **Acesse no navegador:**
   Abra `http://localhost:3000` para visualizar a área do aluno.

---

## 🛡️ Aspectos de Segurança (AppSec)

* **Supabase RLS (Row Level Security):** O acesso aos dados é restrito diretamente na camada do banco de dados (Políticas que limitam escritas e deletes apenas para usuários validados).
* **Server Actions Seguras:** Mutações de dados ocorrem inteiramente do lado do servidor sem expor lógicas sensíveis ao navegador cliente.
* **Defesa em Profundidade:** A rota administrativa utiliza técnicas de interceptação e monitoramento para proteger a rota gerencial real contra ataques de exaustão e scraping.

---

*Desenvolvido como projeto institucional para o curso de Sistemas de Informação - UEMG (Unidade Carangola).*
