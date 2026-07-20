# IMPLEMENTATION PLAN: Calendário de Provas - SI UEMG Carangola

## User Review Required
> [!IMPORTANT]
> Este plano consolida a arquitetura definida nas respostas do Arquiteto Socrático. Revise os detalhes técnicos, como o uso do **Next.js**, **Supabase**, a abordagem de **exportação em PDF** e o fluxo de Sprints. Se estiver de acordo com esta fundação, aprove o plano clicando no botão para prosseguirmos com a execução.

## Open Questions
> [!TIP]
> Nenhuma questão técnica fundamental restante. A arquitetura foi 100% validada (Acesso anônimo por alunos = Zero problema com LGPD; Supabase + Vercel = Custo Zero; PDF Export = Resiliência Offline resolvida; Login Supabase Auth = Segurança na área do Coordenador).

## Proposed Changes / Roadmap de Sprints

### Sprint 1: Setup e Autenticação
- Inicializar projeto Next.js + TailwindCSS + Shadcn/ui.
- Configurar projeto Supabase e definir schema inicial (Tabelas: Provas, Disciplinas, Professores, Semestres, Turmas).
- Configurar Row Level Security (RLS) no Supabase (Leitura anônima liberada para as tabelas públicas, Escrita exige auth).
- Desenvolver tela de Login do Administrador.

### Sprint 2: Área Administrativa (CRUD)
- Criar painel administrativo (`/admin`) protegido via Middleware e Server Actions.
- Desenvolver formulários para gerenciamento do cadastro base (Professores e Disciplinas).
- Desenvolver formulário principal de **Cadastro de Provas** (com validação Zod para os campos obrigatórios).
- Implementar checagem restritiva de sobreposição de horário (mesma turma, mesma data/hora) antes de salvar a prova.

### Sprint 3: Interface Pública (Mobile-First)
- Desenvolver a UI base respeitando as cores da UEMG.
- Desenvolver o mecanismo do Tema Visual (Toggle Normal vs "Vedação Eleitoral" - escala de cinza e sem logo).
- Desenvolver tela inicial (`/`) exibindo o *alerta dinâmico* da próxima prova e a listagem vindoura.
- Implementar filtros de busca por Disciplina, Turma, Professor e Status.
- Implementar visualização dos detalhes ampliados da prova (regras, tipo, peso, sala/obs).

### Sprint 4: SPRINT DE REFATORAÇÃO E SEGURANÇA
- OBRIGATÓRIO (Regra do Roadmap): Auditoria de código (clean code), checagem de regras RLS no banco de dados, correção de warnings do React e validação do Lighthouse (Performance e Acessibilidade).

### Sprint 5: Exportação e Finalização
- Implementar funcionalidade de gerar e baixar o **PDF do cronograma** pelo cliente.
- Implementar alerta visual simpático caso o aluno tente acessar o app sem internet.
- Configurar Web Analytics (Vercel) para acompanhamento do KPI de acessos.
- Deploy final em Produção.

## Verification Plan
### Automated Tests
- Testes focados na função de validação (Não permitir dupla marcação para a mesma turma).
### Manual Verification
- Tentativa de acesso não autenticado na rota `/admin` deve redirecionar ao login.
- Tentativa de submeter chamadas de API forjadas sem token Auth deve ser barrada pelo Supabase RLS.
- Alternar o layout para o modo "Vedação Eleitoral" e confirmar visualmente a aplicação dos filtros cinzas.
- Gerar o PDF na plataforma mobile e verificar a legibilidade.
