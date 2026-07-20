# Lições Aprendidas (Lessons Learned)

Este documento atua como um registro cumulativo de decisões arquiteturais, vulnerabilidades resolvidas e otimizações implementadas, garantindo evolução técnica livre de regressões.

## Segurança e Zero Trust

* **[Segurança] Server Actions Públicas no App Router**: O uso do `middleware.ts` para proteger rotas da interface (ex: `/admin/*`) **não bloqueia invocações diretas às Server Actions** caso a assinatura do endpoint seja descoberta. 
  * *Resolução*: Foi criado o helper `requireAuth()` dentro do utilitário Supabase (`src/utils/supabase/server.ts`) para garantir o princípio de Confiança Zero. Qualquer ação que modifique o banco (`actions.ts`) agora deve invocar a checagem imperativa da sessão (`const { supabase, user } = await requireAuth()`), bloqueando ataques CSRF/Direct-call.

## Funcionalidade e Regras de Negócio

* **[Provas] Checagem de Choque de Horário**: A regra de impedir que uma turma tenha provas sobrepostas ou na mesma data exigiu manipulação de Timezones via JS para construir os limiares `startOfDay` e `endOfDay` (UTC) antes de delegar a filtragem `gte` e `lte` para o Supabase.
