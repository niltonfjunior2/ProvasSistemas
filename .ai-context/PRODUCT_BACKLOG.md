# PRODUCT BACKLOG: Calendário de Provas - SI UEMG Carangola

## Epics & Features

### Epic 1: Infraestrutura e Base (Sprint 0)

- **Feature 1.1:** Setup do repositório (Next.js, Tailwind, Shadcn).
- **Feature 1.2:** Configuração do Supabase (Database, Auth, RLS).
- **Feature 1.3:** Setup de deploy automatizado na Vercel.
- **Feature 1.4:** Implementação do provedor de tema (Cores UEMG / Modo Vedação Eleitoral).

### Epic 2: Visualização Pública (Alunos)

- **Feature 2.1:** Interface Mobile-first de Calendário / Lista de Próximas Provas.
- **Feature 2.2:** Filtros dinâmicos (Disciplina, Turma, Professor, Status).
- **Feature 2.3:** Detalhes da Prova (modal ou página interna).
- **Feature 2.4:** Alerta dinâmico no topo informando a próxima prova geral.
- **Feature 2.5:** Exportação do Calendário Completo para PDF (Offline Support).
- **Feature 2.6:** Alerta visual de falha de conexão de internet.

### Epic 3: Área Administrativa (Coordenador)

- **Feature 3.1:** Login Seguro (Supabase Auth).
- **Feature 3.2:** Gerenciamento de Entidades (Semestres, Turmas, Disciplinas e Professores).
- **Feature 3.3:** CRUD de Provas (Agendamento, cancelamento, adiamento, com tracking de status).
- **Feature 3.4:** Validação de conflito de horário/turma no backend ao salvar.

### Módulo: Tipos de Avaliação (Entregue)

- **Descrição**: Centraliza os tipos de avaliações ("1ª Avaliação", "Exame Final", etc.) em uma tabela `tipos_avaliacao` no Supabase, permitindo que coordenadores gerenciem novas modalidades dinamicamente.
- **Integração**: Formulário de agendamento de Provas agora constrói o `<Select>` utilizando SSR desta tabela, mas armazena o nome string no histórico de `provas` para manter compatibilidade com dados retroativos.
- **Ações Realizadas**: Criação de `page.tsx`, `client-page.tsx`, `actions.ts` e interface genérica em `src/types`.

### Módulo: Segurança e Obfuscação (Entregue)

- **Descrição**: Criação de Honeypot na antiga rota `/admin` para interceptar e simular tentativas de acesso indevido sem onerar o banco de dados. Migração da área administrativa real para `/provas-si-admin`.
- **Integração**: Middleware ajustado para proteger exclusivamente a nova rota. Implementação de logouts baseados em Server Actions (`signout`) para evitar rotas 404 estáticas.
- **Ações Realizadas**: Múltiplas substituições de path (`multi_replace_file_content`), atualização de Layouts, `actions.ts`, e injeção de interface para `fakeLogin`.
