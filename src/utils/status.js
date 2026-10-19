import { cores } from '../theme';

// RN006 — todo pedido possui um status definido, seguindo este fluxo
export const FLUXO = ['Solicitada', 'Em análise', 'Orçamento enviado', 'Aprovada', 'Em execução', 'Concluída'];

export const STATUS_SOLICITACAO = ['Solicitada', 'Em análise', 'Orçamento enviado', 'Recusada', 'Cancelada'];
export const STATUS_PEDIDO = ['Aprovada', 'Em execução', 'Concluída'];

// RN005 — cancelamento somente antes do atendimento (execução) ser iniciado
export const CANCELAVEIS = ['Solicitada', 'Em análise', 'Orçamento enviado'];

export const COR_STATUS = {
  Solicitada: cores.muted,
  'Em análise': cores.info,
  'Orçamento enviado': cores.aviso,
  Aprovada: cores.sucesso,
  'Em execução': cores.destaque,
  Concluída: cores.sucesso,
  Recusada: cores.erro,
  Cancelada: cores.erro,
};

export const DESCRICAO_STATUS = {
  Solicitada: 'Recebemos a sua solicitação.',
  'Em análise': 'Nossa equipe está validando a geometria do modelo.',
  'Orçamento enviado': 'O orçamento está pronto. Aprove ou recuse para continuar.',
  Aprovada: 'Orçamento aprovado. Vamos alocar o projeto na produção.',
  'Em execução': 'Sua peça está sendo fatiada e impressa.',
  Concluída: 'Pedido finalizado e pronto para expedição.',
  Recusada: 'Orçamento recusado. A solicitação foi encerrada.',
  Cancelada: 'Solicitação cancelada.',
};

export const ehPedido = (p) => STATUS_PEDIDO.includes(p.status);
export const ehSolicitacao = (p) => !ehPedido(p);
