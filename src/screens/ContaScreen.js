import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, LinearTransition } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import Titulo from '../components/Titulo';
import Card from '../components/Card';
import Tabs from '../components/Tabs';
import Button from '../components/Button';
import StatusPill from '../components/StatusPill';
import EmptyState from '../components/EmptyState';
import AuthGate from '../components/AuthGate';
import Reveal from '../components/Reveal';
import { cores, fontes } from '../theme';
import { useAuth } from '../store/AuthContext';
import { useOrders } from '../store/OrdersContext';
import { ehPedido, ehSolicitacao } from '../utils/status';
import { confirmar } from '../utils/dialogos';
import { formatarPreco } from '../utils/format';

const ABAS = [
  { id: 'solicitacoes', rotulo: 'Solicitações' },
  { id: 'pedidos', rotulo: 'Pedidos' },
];

const iniciais = (nome = '') => nome.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('') || '?';
const resumo = (p) => `${p.servico} · ${p.materialNome} · ${p.cor} · ${p.quantidade} un.`;

export default function ContaScreen({ navigation }) {
  const { usuario, sair } = useAuth();
  const { pedidos } = useOrders();
  const [aba, setAba] = useState('solicitacoes');

  const solicitacoes = pedidos.filter(ehSolicitacao);
  const aprovados = pedidos.filter(ehPedido);
  const lista = aba === 'solicitacoes' ? solicitacoes : aprovados;

  const abrir = (id) => navigation.navigate('Pedido', { id });

  const fazerSair = () =>
    confirmar({
      titulo: 'Sair da conta',
      mensagem: 'Você precisará entrar novamente para solicitar orçamentos e acompanhar pedidos.',
      confirmarTxt: 'Sair',
      destrutivo: true,
      onConfirm: () => {
        sair();
        navigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
      },
    });

  if (!usuario) {
    return (
      <Screen>
        <Titulo tamanho={26} titulo="Área do cliente" descricao="Acompanhe solicitações e pedidos." />
        <AuthGate retorno="Conta" titulo="Entre na sua conta" texto="Faça login para ver suas solicitações, aprovar orçamentos e acompanhar a produção." />
      </Screen>
    );
  }

  return (
    <Screen>
      <Reveal index={0}>
        <Titulo tamanho={26} titulo="Área do cliente" />
      </Reveal>

      <Reveal index={1}>
        <Card style={styles.perfil} padding={16}>
          <View style={styles.avatar}>
            <Text style={styles.iniciais}>{iniciais(usuario.nome)}</Text>
          </View>
          <View style={{ flex: 1, gap: 3 }}>
            <Text style={styles.nome} numberOfLines={1}>{usuario.nome}</Text>
            <Text style={styles.email} numberOfLines={1}>{usuario.email}</Text>
            {!!usuario.empresa && <Text style={styles.email} numberOfLines={1}>{usuario.empresa}</Text>}
          </View>
        </Card>
      </Reveal>

      <Reveal index={2}>
        <Tabs abas={ABAS} ativa={aba} onChange={setAba} />
      </Reveal>

      <View style={{ gap: 14 }}>
        {lista.length === 0 && (
          <Animated.View entering={FadeIn.duration(250)}>
            <Card>
              <EmptyState
                icone={aba === 'solicitacoes' ? 'document-text-outline' : 'cube-outline'}
                titulo={aba === 'solicitacoes' ? 'Nenhuma solicitação ainda' : 'Nenhum pedido em produção'}
                texto={aba === 'solicitacoes' ? 'Envie um modelo 3D para receber o seu primeiro orçamento.' : 'Quando você aprovar um orçamento, o pedido aparece aqui.'}
                acao={aba === 'solicitacoes' ? 'Pedir orçamento' : undefined}
                onAcao={() => navigation.navigate('Orçamento')}
              />
            </Card>
          </Animated.View>
        )}

        {lista.map((p, i) => (
          <Animated.View key={`${aba}-${p.id}`} entering={FadeInDown.delay(Math.min(i, 6) * 60).duration(360)} layout={LinearTransition.duration(220)}>
            {aba === 'solicitacoes' ? (
              <Pressable onPress={() => abrir(p.id)} accessibilityRole="button" accessibilityLabel={`Solicitação ${p.id}, ${p.status}`}>
                {({ pressed }) => (
                  <Card style={[{ gap: 12 }, pressed && { backgroundColor: cores.abaAtiva }]}>
                    <View style={styles.linha}>
                      <Text style={styles.cardTitulo}>Solicitação #{p.id}</Text>
                      <Ionicons name="chevron-forward" size={18} color={cores.muted} />
                    </View>
                    <Text style={styles.cardTexto}>{resumo(p)}</Text>
                    <StatusPill status={p.status} />
                  </Card>
                )}
              </Pressable>
            ) : (
              <Card style={{ gap: 12 }}>
                <View style={styles.linha}>
                  <Text style={styles.cardTitulo}>Pedido #{p.id}</Text>
                  <StatusPill status={p.status} />
                </View>
                <Text style={styles.cardTexto}>{resumo(p)}</Text>
                <Text style={styles.valor}>{formatarPreco(p.valor)}</Text>
                <Button titulo="Ver pedido" variante="secundario" onPress={() => abrir(p.id)} style={{ height: 48 }} />
              </Card>
            )}
          </Animated.View>
        ))}
      </View>

      <Button titulo="Sair" variante="secundario" onPress={fazerSair} leftIcon={<Ionicons name="log-out-outline" size={18} color={cores.texto} />} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  perfil: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: cores.controle, alignItems: 'center', justifyContent: 'center' },
  iniciais: { color: cores.texto, fontFamily: fontes.krona, fontSize: 18 },
  nome: { color: cores.texto, fontFamily: fontes.krona, fontSize: 15 },
  email: { color: cores.muted, fontSize: 13.5 },
  linha: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  cardTitulo: { color: cores.texto, fontFamily: fontes.krona, fontSize: 15, flexShrink: 1 },
  cardTexto: { color: cores.muted, fontSize: 13.5, lineHeight: 19 },
  valor: { color: cores.texto, fontFamily: fontes.krona, fontSize: 18 },
});
