raiz-do-seu-projeto/
├── .ai/        <-- Pasta central de governança (oculta para não poluir)
│   ├── personas/                <-- Seus prompts de atuação (IMUTÁVEIS)
│   │   ├── 1.1-arquiteto_socratico.md
│   │   ├── 2.1-desenvolvedor_sprint.md
│   │   ├── 3.1-refatorar.md
│   │   └── 4.1-auditor_sprint.md
│   └── templates/               <-- Modelos base vazios (IMUTÁVEIS)
│       ├── roadmap.md
│       ├── project_dna.md
│       └── lessons_learned.md
│
├── .ai-context/        <-- A "Verdade Operacional" do projeto (VIVOS/MUTÁVEIS)
│   ├── PROJECT_DNA.md           <-- Gerado pelo Arquiteto
│   ├── PRODUCT_BACKLOG.md       <-- Gerado pelo Arquiteto
│   ├── IMPLEMENTATION_PLAN.md   <-- Gerado pelo Arquiteto
│   ├── ROADMAP.md               <-- Atualizado a cada fase
│   └── LESSONS_LEARNED.md       <-- Atualizado pelo Auditor
│
└── src/                         <-- O código-fonte real da sua aplicação
