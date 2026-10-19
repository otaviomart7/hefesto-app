import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { CHAVES, gravar, ler } from './storage';

const CartContext = createContext(null);
export const useCarrinho = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [itens, setItens] = useState([]);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    ler(CHAVES.carrinho, []).then((v) => {
      setItens(v);
      setPronto(true);
    });
  }, []);

  useEffect(() => {
    if (pronto) gravar(CHAVES.carrinho, itens);
  }, [itens, pronto]);

  const adicionar = useCallback((item) => {
    const chave = `${item.id}-${item.cor}`;
    setItens((atual) => {
      const existe = atual.find((i) => i.chave === chave);
      if (!existe) return [...atual, { ...item, chave }];
      return atual.map((i) => (i.chave === chave ? { ...i, qtd: i.qtd + item.qtd } : i));
    });
  }, []);

  const alterarQtd = useCallback((chave, qtd) => {
    if (qtd < 1) return;
    setItens((atual) => atual.map((i) => (i.chave === chave ? { ...i, qtd } : i)));
  }, []);

  const remover = useCallback((chave) => setItens((atual) => atual.filter((i) => i.chave !== chave)), []);
  const limpar = useCallback(() => setItens([]), []);

  const valor = useMemo(() => {
    const total = itens.reduce((s, i) => s + i.preco * i.qtd, 0);
    const quantidade = itens.reduce((s, i) => s + i.qtd, 0);
    return { itens, adicionar, alterarQtd, remover, limpar, total, quantidade };
  }, [itens, adicionar, alterarQtd, remover, limpar]);

  return <CartContext.Provider value={valor}>{children}</CartContext.Provider>;
}
