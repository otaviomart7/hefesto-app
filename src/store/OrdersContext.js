import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { CHAVES, gravar, ler } from './storage';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { buscarMaterial } from '../data/catalogo';
import { CANCELAVEIS } from '../utils/status';

const OrdersContext = createContext(null);
export const useOrders = () => useContext(OrdersContext);

/*
 * Sem backend, o andamento é simulado no aparelho para demonstrar o fluxo (RN006):
 * Solicitada → Em análise → Orçamento enviado → (cliente aprova) → Aprovada → Em execução → Concluída.
 * Tempos em ms, ajuste à vontade para a apresentação.
 */
export const ATRASO_ETAPA = {
  Solicitada: 6000,
  'Em análise': 12000,
  Aprovada: 8000,
  'Em execução': 25000,
};
const PROXIMA = {
  Solicitada: 'Em análise',
  'Em análise': 'Orçamento enviado',
  Aprovada: 'Em execução',
  'Em execução': 'Concluída',
};

const PESO_MEDIO_G = 120; // estimativa por peça
const TAXA_SERVICO = 35;

export function calcularOrcamento(p) {
  const m = buscarMaterial(p.materialId);
  const material = m ? m.precoGrama * PESO_MEDIO_G * p.quantidade : 0;
  return Math.round((material + TAXA_SERVICO + (p.itensTotal || 0)) * 100) / 100;
}

function avancar(pedido, agora) {
  let atual = pedido;
  const mudancas = [];
  while (PROXIMA[atual.status]) {
    const prazo = new Date(atual.statusDesde).getTime() + ATRASO_ETAPA[atual.status];
    if (prazo > agora) break;
    const novoStatus = PROXIMA[atual.status];
    const em = new Date(prazo).toISOString();
    atual = {
      ...atual,
      status: novoStatus,
      statusDesde: em,
      historico: [...atual.historico, { status: novoStatus, em }],
      valor: novoStatus === 'Orçamento enviado' ? calcularOrcamento(atual) : atual.valor,
    };
    mudancas.push(novoStatus);
  }
  return { pedido: atual, mudancas };
}

export function OrdersProvider({ children }) {
  const { usuario } = useAuth();
  const { notificar } = useToast();
  const [pedidos, setPedidos] = useState([]);
  const ref = useRef([]);
  const emailAtual = useRef(null);
  emailAtual.current = usuario?.email ?? null;

  const aplicar = useCallback((lista) => {
    ref.current = lista;
    setPedidos(lista);
    gravar(CHAVES.pedidos, lista);
  }, []);

  useEffect(() => {
    ler(CHAVES.pedidos, []).then((v) => {
      ref.current = v;
      setPedidos(v);
    });
  }, []);

  // "tempo real" simulado
  useEffect(() => {
    const id = setInterval(() => {
      const agora = Date.now();
      let mudou = false;
      const avisos = [];
      const nova = ref.current.map((p) => {
        const { pedido, mudancas } = avancar(p, agora);
        if (mudancas.length) {
          mudou = true;
          if (p.dono === emailAtual.current) avisos.push({ id: p.id, status: mudancas[mudancas.length - 1] });
        }
        return pedido;
      });
      if (mudou) {
        aplicar(nova);
        avisos.forEach((a) =>
          notificar(
            `Solicitação #${a.id}`,
            a.status === 'Orçamento enviado' ? 'Seu orçamento está pronto para aprovação.' : `Status atualizado: ${a.status}.`,
            a.status === 'Concluída' ? 'sucesso' : 'info'
          )
        );
      }
    }, 2500);
    return () => clearInterval(id);
  }, [aplicar, notificar]);

  const criar = useCallback(
    (dados) => {
      const maior = ref.current.reduce((m, p) => Math.max(m, Number(p.id)), 1000);
      const id = String(maior + 1);
      const agora = new Date().toISOString();
      const pedido = {
        ...dados,
        id,
        dono: emailAtual.current,
        status: 'Solicitada',
        valor: null,
        criadoEm: agora,
        statusDesde: agora,
        historico: [{ status: 'Solicitada', em: agora }],
      };
      aplicar([pedido, ...ref.current]);
      return id;
    },
    [aplicar]
  );

  const mudarStatus = useCallback(
    (id, de, para) => {
      const p = ref.current.find((x) => x.id === id);
      if (!p || !de.includes(p.status)) return false;
      const em = new Date().toISOString();
      aplicar(
        ref.current.map((x) =>
          x.id === id ? { ...x, status: para, statusDesde: em, historico: [...x.historico, { status: para, em }] } : x
        )
      );
      return true;
    },
    [aplicar]
  );

  const aprovar = useCallback((id) => mudarStatus(id, ['Orçamento enviado'], 'Aprovada'), [mudarStatus]);
  const recusar = useCallback((id) => mudarStatus(id, ['Orçamento enviado'], 'Recusada'), [mudarStatus]);
  const cancelar = useCallback((id) => mudarStatus(id, CANCELAVEIS, 'Cancelada'), [mudarStatus]);

  const meus = useMemo(
    () => (usuario ? pedidos.filter((p) => p.dono === usuario.email) : []),
    [pedidos, usuario]
  );
  const buscar = useCallback((id) => pedidos.find((p) => p.id === id), [pedidos]);

  const valor = useMemo(
    () => ({ pedidos: meus, buscar, criar, aprovar, recusar, cancelar }),
    [meus, buscar, criar, aprovar, recusar, cancelar]
  );
  return <OrdersContext.Provider value={valor}>{children}</OrdersContext.Provider>;
}
