#!/bin/bash
mkdir -p .ai/personas .ai/templates .ai-context/specs

touch .ai/personas/1.1-arquiteto_socratico.md
touch .ai/personas/2.1-desenvolvedor_sprint.md
touch .ai/personas/3.1-refatorar.md
touch .ai/personas/4.1-auditor_sprint.md

touch .ai/templates/roadmap.md
touch .ai/templates/project_dna.md
touch .ai/templates/lessons_learned.md
touch .ai/templates/boas_praticas.md

touch .ai-context/PROJECT_DNA.md
touch .ai-context/PRODUCT_BACKLOG.md
touch .ai-context/IMPLEMENTATION_PLAN.md

cat << 'EOF' > .ai-context/LESSONS_LEARNED.md
---
type: lessons_learned
status: active
---
EOF

cat << 'EOF' > .ai-context/ROADMAP.md
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
EOF
