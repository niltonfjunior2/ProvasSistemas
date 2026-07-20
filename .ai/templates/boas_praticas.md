# Guia de Boas Práticas de Engenharia de Software

Este é um guia consolidado de boas práticas aplicável a projetos futuros.

## 1. Arquitetura e Lógica de Negócios

* **Idempotência em Scripts de Banco de Dados:** Scripts de manutenção e migração devem ser executáveis múltiplas vezes sem falhas. Sempre utilize comandos de limpeza ou verificação (ex: `DROP POLICY IF EXISTS` ou `ADD COLUMN IF NOT EXISTS`) antes de criar estruturas.
* **Operações de "Desfazer" (Undo) Exigem Limpeza de Colaterais:** Reverter um status de uma entidade de "Concluído" para "Pendente" exige mais do que apenas mudar uma *flag*. É imperativo limpar explicitamente os metadados gerados (como datas de conclusão e assinaturas) para garantir um estado limpo na nova iteração.
* **Cálculo de SLAs e Prazos (Ancoragem Imutável):** Em fluxos de trabalho sequenciais, nunca calcule prazos com base na data de atualização (`updatedAt`) do próprio registro, pois ela é transiente. Ancore o início de prazos em eventos passados imutáveis (como a data de conclusão da etapa anterior).
* **Limpeza Real de Produção (TRUNCATE vs DELETE):** Ao resetar um banco de dados para produção ou homologação, evite comandos `DELETE`, pois eles não resetam os IDs auto-incrementais. Utilize sempre `TRUNCATE TABLE ... RESTART IDENTITY CASCADE` para limpar dependências e reiniciar sequências.
* **Proteção de Custos com "Circuit Breakers" e Fallbacks:** Ao consumir APIs externas (especialmente IAs com limite de cotas):
  * Crie variáveis globais de "Cooldown" para bloquear requisições à API primária temporariamente após um erro (evitando desperdício de tempo e bloqueios).
  * Implemente arrays de provedores e faça a rotação (Round-Robin) entre eles caso haja falhas, diluindo o consumo de recursos.
* **Proxy de Mídia Universal (Catch-all):** Para servir arquivos locais via API (mantendo segurança de diretórios), utilize rotas dinâmicas do tipo `[...slug]`. Isso garante que subpastas organizacionais (ex: `/artigos/img/foto.png`) sejam capturadas integralmente pela rota, permitindo reconstruir o caminho do arquivo com `path.join(...slug)`.
* **Processamento de Arquivos "Zero-Cost":** Para contornar limites de *payload* (tamanho de envio) em servidores serverless, processe e extraia dados (como texto de PDFs ou documentos) utilizando bibliotecas no próprio navegador (client-side). Envie apenas o texto bruto extraído para a API.
* **Soberania do Nome do Arquivo sobre Metadados:** Em sistemas de roteamento baseados em arquivos físicos (como Markdown + Next.js), utilize o nome do arquivo como a única fonte da verdade para a geração de URLs (slugs). Evite confiar em campos de `slug` definidos no metadado (YAML) para roteamento, pois eles podem ser esquecidos em renomeações, quebrando links em outros lugares do site.

## 2. Banco de Dados e Modelagem de Dados

* **Fuso Horário e Datas "Burocráticas":** Datas sem horas atreladas (ex: data de nascimento, feriados) salvas como UTC no banco frequentemente aparecem como "dia anterior" na interface se convertidas livremente para o fuso local do navegador. Trate essas datas como strings fixas (`YYYY-MM-DD`) ou force a formatação UTC no momento da exibição.
* **Agregação de Dados Server-Side:** Em dashboards, nunca envie *arrays* ou dados brutos para o cliente (navegador) apenas para contá-los ou agrupá-los. Toda agregação e cálculo de frequência devem ser resolvidos no servidor para economizar banda.
* **ENUMs vs Entradas Dinâmicas:** Se os valores de uma coluna de banco de dados podem ser cadastrados ou editados pelo usuário via interface (CRUD), evite tipar essa coluna como `ENUM` estrito no banco. Utilize colunas de texto (`TEXT` ou `VARCHAR`) e deixe a validação das opções permitidas a cargo da aplicação.
* **Consistência de Schema no Código:** Ao alterar o nome de uma coluna no banco de dados, faça imediatamente uma busca global (grep) em todo o código-fonte (especialmente em tipagens TypeScript e queries raw) para evitar falhas silenciosas de dados "fantasmas".

## 3. Frontend (React / Next.js)

* **Prevenção de Inconsistência de Hidratação (Hydration Mismatches):**
  * Em componentes que geram conteúdo dinâmico baseado em tempo (ex: "há 4 min" usando `Date.now()`), adicione flags de `suppressHydrationWarning` na tag HTML correspondente.
  * Se componentes geram IDs ou usam APIs não determinísticas, isole-os em wrappers client-side forçando a montagem após o carregamento ou desligando a renderização no servidor (`ssr: false`).
* **Reset de Estado em Formulários (React Key Pattern):** Formulários não resetam nativamente ao receber novos dados devido ao ciclo de vida do `useState`. Force a re-instanciação passando uma propriedade `key` baseada no ID do item sendo editado (Ex: `<Form key="{item.id}"/>`).
* **Isolamento de Componentes (Server vs Client):** Separe responsabilidades em três camadas: *Página* (Faz chamadas ao banco no servidor) -> *Componente Wrapper* (Possui a interatividade client-side, botões, modais) -> *Server Action* (Executa a mutação dos dados).
* **Sincronização de Estado Nativa:** Para sincronizar múltiplos componentes no frontend de forma global (sem bibliotecas pesadas), utilize a API nativa de eventos do navegador (`window.dispatchEvent` e `window.addEventListener`).
* **Controle Cauteloso de Cache:** Em painéis administrativos onde a exibição de dados atualizados é crítica, force ativamente a renderização dinâmica e desabilite o cache da rota.
* **Isolamento de line-clamp de Elementos Flexbox:** Não aplique classes de redimensionamento flexbox (`flex-grow` ou `flex-1`) diretamente no mesmo elemento `<p>` que possui `line-clamp`. Isso causa esticamento vertical e quebra a elipse. Em vez disso, coloque as classes flex na `div` envolvente (wrapper) e mantenha a tag `<p>` livre de regras flexbox.


## 4. UX (Experiência do Usuário) e Interface

* **Evite o Paradigma de "Botões Desabilitados" Silenciosos:** Botões inativos por regras de negócio (ex: formulário fechado temporariamente) podem parecer falha de interface. Substitua a desabilitação nativa por comunicação clara: use botões com cores normais que abrem avisos explicativos (badges/alertas) indicando ativamente *o porquê* de a ação estar bloqueada.
* **Interface Otimista (Optimistic UI):** Em ações simples, como botões de ativar/desativar (toggles), atualize o estado visual da interface instantaneamente, antes mesmo do servidor responder. Reverta visualmente apenas se a requisição falhar, melhorando a percepção de velocidade do sistema.
* **Hierarquia Visual Direta:** A ação principal de uma tela (o próximo passo lógico para o usuário) deve ter sempre destaque máximo na interface (botão com cor sólida). Ações secundárias devem usar estilos com contornos (`outline`).
* **Skeletons para Feedback de Carregamento:** Para evitar telas em branco repentinas enquanto os dados são buscados, utilize layouts "esqueleto" (Skeletons) que simulem a estrutura da tela final.
* **Mensagens de Erro Traduzidas e Dinâmicas:** Intercepte códigos de erros criptográficos do banco de dados (ex: Constraint ou chaves duplicadas) e traduza-os para o idioma do usuário final. Além disso, force o redesenho (re-render) de alertas visuais, como *Toasts*, adicionando timestamps aos erros para que múltiplas tentativas frustradas seguidas continuem gerando reações na tela.

## 5. Segurança e Privacidade

* **Purificação de Dados (Strip-at-Source):** Remova Informações Pessoalmente Identificáveis (PII) sensíveis logo no momento da submissão do formulário na camada do cliente (antes do *payload* trafegar na rede), caso elas não sejam absolutamente necessárias para o banco de dados.
* **Proteção de Rotas para Perfis Críticos:** Jamais habilite páginas públicas de auto-cadastro (Self-Service Sign Up) para funções que exijam validação institucional (como Coordenadores, Administradores, Professores). Toda conta de privilégio elevado deve ser criada por vias administrativas ou *scripts de seed* isolados.
* **Não Confie Apenas no DB para Omissão de Dados:** Em listagens e diretórios públicos, filtre explicitamente as *roles* e perfis de administradores dentro do código backend da sua consulta (ex: `.in('role', ['aluno', 'egresso'])`). Não delegue a ocultação exclusiva às Políticas de Segurança em Nível de Linha (RLS).


## 4. UX (Experiência do Usuário) e Interface

* **Evite o Paradigma de "Botões Desabilitados" Silenciosos:** Botões inativos por regras de negócio (ex: formulário fechado temporariamente) podem parecer falha de interface. Substitua a desabilitação nativa por comunicação clara: use botões com cores normais que abrem avisos explicativos (badges/alertas) indicando ativamente *o porquê* de a ação estar bloqueada.
* **Interface Otimista (Optimistic UI):** Em ações simples, como botões de ativar/desativar (toggles), atualize o estado visual da interface instantaneamente, antes mesmo do servidor responder. Reverta visualmente apenas se a requisição falhar, melhorando a percepção de velocidade do sistema.
* **Hierarquia Visual Direta:** A ação principal de uma tela (o próximo passo lógico para o usuário) deve ter sempre destaque máximo na interface (botão com cor sólida). Ações secundárias devem usar estilos com contornos (`outline`).
* **Skeletons para Feedback de Carregamento:** Para evitar telas em branco repentinas enquanto os dados são buscados, utilize layouts "esqueleto" (Skeletons) que simulem a estrutura da tela final.
* **Mensagens de Erro Traduzidas e Dinâmicas:** Intercepte códigos de erros criptográficos do banco de dados (ex: Constraint ou chaves duplicadas) e traduza-os para o idioma do usuário final. Além disso, force o redesenho (re-render) de alertas visuais, como *Toasts*, adicionando timestamps aos erros para que múltiplas tentativas frustradas seguidas continuem gerando reações na tela.

## 5. Segurança e Privacidade

* **Purificação de Dados (Strip-at-Source):** Remova Informações Pessoalmente Identificáveis (PII) sensíveis logo no momento da submissão do formulário na camada do cliente (antes do *payload* trafegar na rede), caso elas não sejam absolutamente necessárias para o banco de dados.
* **Proteção de Rotas para Perfis Críticos:** Jamais habilite páginas públicas de auto-cadastro (Self-Service Sign Up) para funções que exijam validação institucional (como Coordenadores, Administradores, Professores). Toda conta de privilégio elevado deve ser criada por vias administrativas ou *scripts de seed* isolados.
* **Não Confie Apenas no DB para Omissão de Dados:** Em listagens e diretórios públicos, filtre explicitamente as *roles* e perfis de administradores dentro do código backend da sua consulta (ex: `.in('role', ['aluno', 'egresso'])`). Não delegue a ocultação exclusiva às Políticas de Segurança em Nível de Linha (RLS).

## 6. IA e Integrações

* **Engenharia de Prompt para Formulários:** Ao usar Inteligência Artificial para gerar ou refinar textos que alimentarão diretamente campos de banco de dados ou inputs de texto simples, proíba explicitamente no seu *System Prompt* o uso de saudações ("Aqui está o seu texto...") e de formatações complexas (Markdown, asteriscos, *hashtags*).
* **Captura de Tela de Sites baseados em SPA:** Para gerar capturas de tela dinâmicas (screenshots) de links informados por usuários, prefira APIs que processem completamente client-side rendering e scripts (como o Thum.io) em vez de APIs de scraping simples (como mShots ou Microlink sem parâmetros específicos), evitando que layouts baseados em frameworks modernos (React, Vue, Flutter Web) apareçam em HTML cru e sem estilização.

## 7. Padronização de Artigos (Markdown/YAML)

* **YAML Front Matter Obrigatório:** Todo novo artigo deve seguir o template em `rag/template_artigo.md`. Campos críticos: `coverImage`, `author` (string), `description` (nível superior) و `seo.canonical` (URL completa).
* **Gestão de Imagens (Hero):** A imagem de topo (Hero) deve ser declarada em `coverImage`. O sistema remove automaticamente a imagem do corpo do texto se o caminho for idêntico ao `coverImage`, evitando duplicidade visual.
* **SEO e URLs:** Utilize sempre o domínio oficial `https://professornilton.vercel.app/` nos campos canônicos e schemas.
* **Componentes Customizados:** O parser suporta redimensionamento de imagem via alt text (`Alt | 50%`) e incorporação automática de vídeos do YouTube via links diretos.

## 8. Segurança em Server Actions (Next.js)

* **Autenticação no Nível da Ação (RBAC Profundo):** *Server Actions* são expostas nativamente como endpoints públicos da API. Embora o Middleware do Next.js proteja as rotas, ele não impede que ferramentas forjem chamadas diretas para `/_next/action`. É **obrigatório** verificar o cookie de sessão (`await supabase.auth.getUser()`) diretamente no corpo da *Server Action* antes de executar qualquer mutação no banco de dados.
* **DRY em Validação de Autenticação:** Extraia verificações repetitivas de Server Actions para um utilitário de middleware lógico (ex: `requireAdmin()`). Isso reduz a superfície de erro e facilita atualizações futuras no provedor de Auth.
* **Validação Rigorosa (Zero Trust) em Mutações:** O HTML nativo não oferece garantias ao servidor. Nunca faça *casting* cego (`as string`) dos valores de um `FormData`. Intercepte todos os *payloads* de formulário com uma biblioteca de validação esquemática (como o `zod`) nas Server Actions para prevenir inserções corrompidas no banco de dados.

## 9. Ambiente e Infraestrutura

* **Exclusão de Pastas com Caracteres Especiais no PowerShell:** Ao utilizar comandos de automação (como `Remove-Item`) no Windows PowerShell para deletar pastas do App Router que contêm chaves ou colchetes (ex: `[filename]`), o PowerShell interpreta os colchetes como curingas (wildcards). É imperativo utilizar a flag `-LiteralPath` (ex: `Remove-Item -LiteralPath "[filename]"`) para garantir que o alvo seja lido como string literal.

## 10. SEO e Compartilhamento Social

* **Open Graph e Link Previews:** Para garantir que os links gerem previews com imagem, título e descrição ao serem compartilhados no WhatsApp e outras redes, mantenha os requisitos de Open Graph configurados no `layout.tsx` (App Router) usando a propriedade `metadataBase`. Para imagens, siga as regras de peso (<300KB) e dimensões. As instruções detalhadas estão no arquivo [boas_praticas_open_graph.md](boas_praticas_open_graph.md).
