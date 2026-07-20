New-Item -ItemType Directory -Force -Path ".ai\personas"
New-Item -ItemType Directory -Force -Path ".ai\templates"
New-Item -ItemType Directory -Force -Path ".ai-context\specs"

$emptyFiles = @(
    ".ai\personas\1.1-arquiteto_socratico.md",
    ".ai\personas\2.1-desenvolvedor_sprint.md",
    ".ai\personas\3.1-refatorar.md",
    ".ai\personas\4.1-auditor_sprint.md",
    ".ai\templates\roadmap.md",
    ".ai\templates\project_dna.md",
    ".ai\templates\lessons_learned.md",
    ".ai\templates\boas_praticas.md",
    ".ai-context\PROJECT_DNA.md",
    ".ai-context\PRODUCT_BACKLOG.md",
    ".ai-context\IMPLEMENTATION_PLAN.md"
)

foreach ($file in $emptyFiles) {
    New-Item -ItemType File -Force -Path $file
}

$lessonsLearnedContent = @"
---
type: lessons_learned
status: active
---
"@

Set-Content -Path ".ai-context\LESSONS_LEARNED.md" -Value $lessonsLearnedContent -Encoding UTF8

$roadmapContent = @"
# ROADMAP DO PROJETO: [NOME DO PROJETO]

> Este roadmap define as fases de desenvolvimento, baseado na Arquitetura Consolidada definida no `.ai-context/PROJECT_DNA.md`.
> **Regra de Refatoração:** A cada 3 fases de funcionalidades novas, é OBRIGATÓRIO inserir uma "Fase de Sprint de Refatoração e Segurança" usando o prompt `3.1-refatorar.md`.

---

## Fase 0: Setup Inicial e Infraestrutura [ ]

**Objetivo:** Configurar o repositório base, ambiente de desenvolvimento e infraestrutura essencial.

**Checklist Técnico:**

- [x] Inicializar a estrutura de governança cognitiva (.ai/ e .ai-context/).
- [ ] Configurar repositório Git e isolar credenciais no .gitignore.
- [ ] Estruturar pastas iniciais da aplicação de acordo com a stack definida no DNA.

**Definição de Pronto (DoD):**

- [ ] Projeto estruturado com as pastas de governança sem conflitos com o código-fonte principal.
"@

Set-Content -Path ".ai-context\ROADMAP.md" -Value $roadmapContent -Encoding UTF8
