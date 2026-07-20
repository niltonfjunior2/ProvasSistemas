**Regras de Negócio do App: Calendário de Provas de Sistemas de Informação - UEMG Carangola**

### 1. **Objetivo do Aplicativo**

O app é um **calendário digital** específico para as provas do curso de **Sistemas de Informação** da Unidade Carangola da UEMG (Universidade do Estado de Minas Gerais). Ele centraliza e facilita o acesso às datas, horários e detalhes das avaliações para alunos, professores e coordenadores.

O aplicativo será construído com custo zero. O projeto será mantido no Github e o deploy será feito na plataforma vercel.

O uso principal será em dispositivos móveis, para usuários Android ou IOs, mas o aplicativo deve também ser um site web, com opção para instalar um atalho no celular dos alunos a partir de um link ou de um qr code.

### 2. **Entidades Principais (Modelo de Dados)**

- **Prova / Evento**: Registro principal.
  - Atributos esperados:
    - Disciplina
    - Data e Hora de Início
    - Tipo de Avaliação (Prova 1, Prova 2, Trabalho, Recuperação, etc.)
    - Professor Responsável
    - Turma / Período / Semestre
    - Observações / Regras específicas (material permitido, peso na nota, etc.)
    - Status (Agendada, Realizada, Cancelada, Adiada)

- **Usuário Administrador**: É o professor coordenador do curso, que faz o cadastro das provas.

### 3. **Regras de Negócio Principais**

#### **Gestão de Eventos (Provas)**

- Toda prova deve ter **data/hora de início obrigatória**.
- Não deve haver **sobreposição de provas** para a mesma turma no mesmo horário (regra de validação ao cadastrar/editar).
- As provas são vinculadas a um **semestre letivo** específico.
- Possibilidade de **adiamento/cancelamento** com registro de justificativa e notificação (se houver automação).
- Histórico de provas passadas deve ser mantido para consulta.
- Primeiro acesso mostra as próximas provas vindouras.

#### **Visualização e Filtros**

- **Calendário principal**: Visualização mensal/semanal/diária com destaque para as datas de provas.
- Filtros por:
  - Disciplina
  - Turma/Período
  - Tipo de avaliação
  - Professor
  - Status
- Busca textual (por disciplina ou professor).

- As interfaces devem respeitar as cores institucionais, que são as seguintes:
As cores institucionais da UEMG são representadas pelo azul e vermelho do Sistema RGB:
R48 - G91 - B125
R227 - G24 - B55
Cores secundárias, que apoiam as cores institucionais, conferem mais dinamismo e ampliam as possibilidades nas composições gráficas:
Sistema RGB
R0 - G43 - B92
R130 - G0 - B36
R163 - G153 - B0
R206 - G208 - B210

É preciso criar um mecanismo de descaracterização das interfaces devido a períodos de vedação eleitoral, quando nenhum logo deve ser exibido e as cores devem ser modificadas para escalas de cinza. O administrador do sistema pode ativar ou desativar o período de vedação eleitoral.

#### **Permissões de Acesso (Regras de Usuário)**

- **Alunos**: Visualização somente (read-only) do calendário e detalhes das provas.
- **Coordenador/Administrador**: Acesso total (CRUD completo e irrestrito através de área administrativa do sistema).

#### **Notificações e Alertas**

- Lembretes automáticos antes das provas quando um aluno acessa o aplicativo (ex: 7 dias, 1 dia e no dia).
- Destaque visual para provas próximas ou em atraso.

#### **Integrações e Exportação**

- Possibilidade de exportar o calendário (iCal/Google Calendar, PDF ou planilha).

### 4. **Fluxos Principais**

1. **Consulta de Calendário** (fluxo principal para alunos):
   - Acessar app → Ver calendário → Filtrar por disciplina/turma → Clicar em evento → Ver detalhes.

2. **Cadastro de Prova** (professores/coordenador):
   - Selecionar disciplina + turma → Informar data/hora → Tipo → Observações → Salvar → Validação de conflito.

3. **Gestão Administrativa**:
   - Gerenciar semestres letivos.
   - Cadastrar disciplinas e professores.
   - Relatórios (ex: quantidade de provas por disciplina).

### 5. **Regras de Validação e Qualidade**

- Data da prova deve ser futura (ao cadastrar) ou permitir histórico.
- Campos obrigatórios: Disciplina, Data/Hora, Tipo.
- Consistência: Uma prova não pode ter data de término anterior à de início.

### 6. **Possíveis Melhorias/Futuras Funcionalidades**

- Notificações push ou e-mail.
- Anexo de arquivos (devolutivas, gabaritos, etc.).
