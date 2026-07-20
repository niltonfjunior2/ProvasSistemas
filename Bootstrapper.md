# ATUAÇÃO: ENGENHEIRO DE PLATAFORMA E DIRETOR DE CONTEXTO

Seu objetivo é inicializar a infraestrutura de governança cognitiva para um novo projeto de software, garantindo o isolamento estrito entre ferramentas de IA (prompts imutáveis) e a verdade operacional do projeto (artefatos vivos).

## 1. DIRETRIZ DE ESTRUTURA DE ARQUIVOS

Você deve gerar os comandos necessários (Bash e PowerShell) ou criar diretamente a seguinte árvore de diretórios na raiz do projeto:

raiz-do-projeto/
├── .ai/
│   ├── personas/
│   └── templates/
└── .ai-context/
    └── specs/

## 2. COMPORTAMENTO EXIGIDO

Gere um script automatizado (`setup-ai.sh` para Linux/Mac e `setup-ai.ps1` para Windows) que:

1. Crie a estrutura de pastas acima de forma silenciosa.
2. Crie os arquivos estruturais vazios (Placeholders) listados abaixo dentro de seus respectivos destinos.
3. Adicione o arquivo `.ai-context/ROADMAP.md` inicializado com a estrutura base padrão.

### Estrutura dos Arquivos de Destino

#### Em `.ai/personas/` (Crie os arquivos em branco apenas para receber os prompts do usuário)

- `1.1-arquiteto_socratico.md`
- `2.1-desenvolvedor_sprint.md`
- `3.1-refatorar.md`
- `4.1-auditor_sprint.md`

#### Em `.ai/templates/` (Crie os arquivos em branco para os modelos de referência)

- `roadmap.md`
- `project_dna.md`
- `lessons_learned.md`
- `boas_praticas.md`

#### Em `.ai-context/` (Arquivos vivos iniciados)

- `PROJECT_DNA.md` (Vazio, aguardando o Arquiteto)
- `PRODUCT_BACKLOG.md` (Vazio, aguardando o Arquiteto)
- `IMPLEMENTATION_PLAN.md` (Vazio, aguardando o Arquiteto)
- `LESSONS_LEARNED.md` (Apenas com o cabeçalho de metadados e taxonomia)
- `ROADMAP.md` (Preenchido com a estrutura padrão abaixo)

---

## 3. CONTEÚDO DO TEMPLATE DO ROADMAP INDUZIDO (`.ai-context/ROADMAP.md`)

Insira exatamente o seguinte conteúdo no arquivo ROADMAP inicial:

"""

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
"""

---

## 4. FORMATO DE SAÍDA

Forneça os blocos de código prontos para execução no terminal. Se você possui capacidade de executar comandos diretamente neste ambiente, execute a criação dos diretórios e arquivos imediatamente e reporte o status.
