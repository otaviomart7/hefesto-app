import { useWindowDimensions } from 'react-native';

// Tokens extraídos do export do Figma (frames "Mobile — …", 402 px de largura)
export const cores = {
  fundo: '#0e1018',
  cabecalho: '#0b0d14',
  card: '#202229',
  controle: '#2d2f38',
  abaAtiva: '#3b3d46',
  texto: '#ffffff',
  textoSuave: '#eceef6',
  muted: '#b4b6c0',
  borda: 'rgba(255,255,255,0.08)',
  erro: '#ff8f8f',
  sucesso: '#7ee2a8',
  aviso: '#f4c430',
  info: '#6cc4ff',
  destaque: '#29b6f6',
};

export const raios = { card: 20, controle: 12, aba: 9, abas: 12, pill: 999 };

// Krona One é a fonte do Figma; parágrafos longos usam a fonte do sistema (igual ao site)
export const fontes = { krona: 'KronaOne_400Regular' };

export const BASE_LARGURA = 402;
export const LARGURA_MAX = 560;

export function useLayout() {
  const { width, height } = useWindowDimensions();
  const escala = Math.min(Math.max(width / BASE_LARGURA, 0.88), 1.3);
  const esc = (n) => Math.round(n * escala);
  return { width, height, escala, esc, tablet: width >= 700 };
}
