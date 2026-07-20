# PROJECT MEMORY & LESSONS LEARNED

> **Para a IA:** Este arquivo é a sua Memória de Longo Prazo. Ele contém soluções para problemas já enfrentados, decisões de arquitetura e "cicatrizes" do projeto.
> **Instrução:** Antes de sugerir correções complexas ou configurações de infraestrutura, CONSULTE este arquivo para ver se o problema já foi resolvido anteriormente. Evite repetir erros documentados aqui.

## 📋 METADADOS DO PROJETO

* **Contexto:** [Inserir breve contexto do projeto]
* **Stack Principal:** [Inserir as tecnologias principais]
* **Gerente de Conhecimento:** Tech Lead Sênior (IA).

---

## 🏷️ TAXONOMIA DE TAGS

Use estas tags para categorizar novas entradas, facilitando a busca semântica:

* `[ARCH]` - Decisões de Arquitetura (Mudanças estruturais)
* `[ENV]` - Variáveis de Ambiente e Configuração (.env, CI/CD)
* `[LIB]` - Bibliotecas e Dependências (Conflitos de versão, deprecations)
* `[DB]` - Banco de Dados (Migrations, Seeds, SQL, RLS)
* `[SEC]` - Segurança, Autenticação e Compliance (Zero Trust, LGPD)
* `[GIT]` - Controle de Versão (Erros de push, merge conflicts)
* `[BUG]` - Erros Críticos Resolvidos (Non-trivial bugs)
* `[UI]` - Interface, Estilização e Experiência do Usuário

---

## 📚 REGISTRO DE CONHECIMENTO (LOG)

*(A IA deve registrar as novas lições abaixo desta linha, sempre com o formato mais recente no topo ou seguindo a ordem cronológica estipulada)*

### [AAAA-MM-DD] - [TAG] Título Curto do Problema ou Decisão

**Sintoma/Contexto:** O que estava acontecendo de errado ou qual era o desafio técnico?
**Causa Raiz:** Qual foi o motivo técnico profundo que gerou o problema?
**Solução Aplicada:** O que foi feito exatamente no código ou na arquitetura para resolver?
**Lição/Regra de Prevenção:** Qual é a regra de ouro que devemos seguir daqui para frente para nunca mais cometer este erro?

### [2026-07-11] - [UI] Classes do TailwindCSS não renderizando
**Sintoma/Contexto:** Classes adicionadas dinamicamente no HTML pela IA (ex: `md:ml-28`) não surtiam efeito no layout da página no navegador.
**Causa Raiz:** O projeto utiliza TailwindCSS com compilação JIT (Just-In-Time) através de um script de build. O arquivo `styles.css` pré-compilado não incluía classes que não estavam presentes no código original, e o watcher (`npm run watch:css`) não estava ativo.
**Solução Aplicada:** Execução manual do comando `npm run build:css` para forçar a recompilação do arquivo de estilos.
**Lição/Regra de Prevenção:** Sempre que adicionar ou modificar classes do Tailwind no HTML, certifique-se de que o watcher (`npm run watch:css`) esteja rodando ou rode o build via terminal.

### [2026-07-11] - [DB] RLS em tabelas nativas do Supabase Storage
**Sintoma/Contexto:** Ao tentar rodar `ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;`, o Supabase retornou o erro `ERROR: 42501: must be owner of table objects`.
**Causa Raiz:** O Supabase já gerencia o RLS da tabela `storage.objects` nativamente. Modificações de dono de tabela ou forçar a habilitação de RLS em tabelas internas via SQL direto sem permissão de superuser resultam em erro.
**Solução Aplicada:** Compreensão de que o RLS já está ativo por padrão no schema `storage`. O controle de segurança deve ser feito exclusivamente pelas *Policies* (ex: `CREATE POLICY`), sem alterar a estrutura da tabela nativa.
**Lição/Regra de Prevenção:** Nunca tente dar `ALTER TABLE ENABLE ROW LEVEL SECURITY` nas tabelas dos schemas nativos de Storage ou Auth do Supabase. Configure apenas as *Policies* associadas a elas.