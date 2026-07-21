export interface Semestre {
  id: string;
  nome: string;
  ativo: boolean;
  created_at?: string;
}

export interface Professor {
  id: string;
  nome: string;
  email?: string;
  created_at?: string;
}

export interface Disciplina {
  id: string;
  nome: string;
  turma_id?: string;
  professor_id?: string;
  turmas?: Turma;
  professores?: Professor;
  created_at?: string;
}

export interface Turma {
  id: string;
  nome: string;
  semestre_id: string;
  semestres?: Semestre;
  created_at?: string;
}

export interface Prova {
  id: string;
  disciplina_id: string;
  turma_id: string;
  data_hora_inicio: string;
  tipo_avaliacao: string;
  observacoes?: string;
  status: string;
  disciplinas?: Disciplina;
  turmas?: Turma;
  created_at?: string;
}

export interface TipoAvaliacao {
  id: string;
  nome: string;
}

export interface Documento {
  id: string;
  titulo: string;
  url: string;
  ativo: boolean;
  created_at?: string;
}
