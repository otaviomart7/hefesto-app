import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { cores, fontes } from '../theme';
import { COR_STATUS, FLUXO } from '../utils/status';
import { formatarData } from '../utils/format';

function PontoAtual({ cor }) {
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withRepeat(withTiming(1, { duration: 1400, easing: Easing.out(Easing.quad) }), -1, false);
  }, [p]);
  const halo = useAnimatedStyle(() => ({ opacity: 0.55 * (1 - p.value), transform: [{ scale: 1 + p.value * 1.1 }] }));
  return (
    <View style={styles.pontoBox}>
      <Animated.View style={[styles.halo, { backgroundColor: cor }, halo]} />
      <View style={[styles.ponto, { backgroundColor: cor, borderColor: cor }]} />
    </View>
  );
}

// Linha do tempo do pedido (rastreio). Encerrados (recusada/cancelada) mostram só o histórico real.
export default function Timeline({ pedido }) {
  const encerrado = pedido.status === 'Recusada' || pedido.status === 'Cancelada';
  const passos = encerrado ? pedido.historico.map((h) => h.status) : FLUXO;
  const indiceAtual = passos.indexOf(pedido.status);
  const quando = (s) => pedido.historico.find((h) => h.status === s)?.em;

  return (
    <View>
      {passos.map((s, i) => {
        const feito = i < indiceAtual || (i === indiceAtual && (s === 'Concluída' || encerrado));
        const atual = i === indiceAtual && !feito;
        const cor = COR_STATUS[s] ?? cores.muted;
        const ultimo = i === passos.length - 1;
        const data = quando(s);
        return (
          <View key={`${s}-${i}`} style={styles.linha}>
            <View style={styles.coluna}>
              {atual ? (
                <PontoAtual cor={cor} />
              ) : (
                <View style={styles.pontoBox}>
                  <View style={[styles.ponto, feito ? { backgroundColor: cor, borderColor: cor } : { borderColor: cores.abaAtiva }]}>
                    {feito && <Ionicons name="checkmark" size={10} color={cores.fundo} />}
                  </View>
                </View>
              )}
              {!ultimo && <View style={[styles.haste, { backgroundColor: i < indiceAtual ? cor : cores.abaAtiva }]} />}
            </View>
            <View style={[styles.texto, ultimo && { paddingBottom: 0 }]}>
              <Text style={[styles.status, { color: feito || atual ? cores.texto : cores.muted }]}>{s}</Text>
              {!!data && <Text style={styles.data}>{formatarData(data)}</Text>}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  linha: { flexDirection: 'row', gap: 14 },
  coluna: { alignItems: 'center', width: 22 },
  pontoBox: { width: 22, height: 22, alignItems: 'center', justifyContent: 'center' },
  halo: { position: 'absolute', width: 14, height: 14, borderRadius: 7 },
  ponto: { width: 16, height: 16, borderRadius: 8, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  haste: { flex: 1, width: 2, borderRadius: 1, marginVertical: 2 },
  texto: { flex: 1, paddingBottom: 22, gap: 2 },
  status: { fontFamily: fontes.krona, fontSize: 12 },
  data: { color: cores.muted, fontSize: 12.5 },
});
