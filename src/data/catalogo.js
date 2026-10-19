import dados from './materiais.json';

export const servicos = dados.servicos;
export const materiais = dados.materiais;

export const LINHAS = [
  { id: 'todas', rotulo: 'Todas' },
  { id: 'virgem', rotulo: 'Virgem' },
  { id: 'especial', rotulo: 'Especial' },
  { id: 'reciclado', rotulo: 'Eco-Tech' },
  { id: 'suporte', rotulo: 'Suporte' },
];

export const ROTULO_LINHA = {
  virgem: 'Virgem técnica',
  especial: 'Especial',
  reciclado: 'Eco-Tech (reciclado)',
  suporte: 'Suporte solúvel',
};

export const buscarMaterial = (id) => materiais.find((m) => m.id === id);

export const todasCores = [...new Set(materiais.flatMap((m) => m.cores.map((c) => c.nome)))].sort();

export const ehResina = (m) => m.id.startsWith('resina');

// preço de venda = 1 kg (mesma regra do site: precoGrama * 1000)
export const precoUnidade = (m) => m.precoGrama * 1000;
