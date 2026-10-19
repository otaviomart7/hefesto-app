import AsyncStorage from '@react-native-async-storage/async-storage';

export const CHAVES = {
  usuarios: 'hefesto:usuarios',
  sessao: 'hefesto:sessao',
  carrinho: 'hefesto:carrinho',
  pedidos: 'hefesto:pedidos',
};

export async function ler(chave, padrao) {
  try {
    const v = await AsyncStorage.getItem(chave);
    return v ? JSON.parse(v) : padrao;
  } catch {
    return padrao;
  }
}

export function gravar(chave, valor) {
  return AsyncStorage.setItem(chave, JSON.stringify(valor)).catch(() => {});
}

export function remover(chave) {
  return AsyncStorage.removeItem(chave).catch(() => {});
}
