# AI EXECUTION GUIDE: Calendário de Provas

## Regras para Agentes e LLMs Operando neste Repositório

1. **Soberania do Custo Zero:** Jamais sugira instalar pacotes ou serviços que exijam cartão de crédito ou que não possuam Free Tier generoso. A hospedagem deve ser na Vercel e o banco de dados no Supabase.
2. **Segurança Supabase:** Qualquer query de banco de dados no frontend para inserção de dados DEVE passar por Server Actions protegidas com a validação da sessão do Supabase (Auth). A RLS (Row Level Security) do banco de dados deve ser devidamente configurada para barrar acessos não autenticados na camada mais baixa.
3. **Privacidade Padrão (Sem PII):** O app não coleta nem armazena PII (Informações Pessoalmente Identificáveis) dos estudantes, dispensando integrações LGPD complexas e mantendo o acesso público 100% anônimo.
4. **Estilização Restrita (Cores UEMG):** O uso de cores arbitrárias no Tailwind é proibido. Utilize sempre as variáveis de CSS definidas no tema (`--uemg-blue`, `--uemg-red`) para garantir que o *toggle* de Vedação Eleitoral (grayscale) funcione globalmente em todo o site.
5. **Resiliência e Erros (Offline):** Não quebre a interface do usuário se a API falhar. Use tratamento de erros para mostrar mensagens amigáveis ("Verifique sua conexão"). Para leitura offline completa, direcione a arquitetura para a geração/exportação de PDF.
6. **Mobile First:** Todo componente de UI deve ser renderizado, estilizado e testado (mentalmente ou via viewport) primeiro na versão mobile. A visão Desktop é apenas um ajuste progressivo.
