import { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import Card from '../components/Card';
import Button from '../components/Button';
import Reveal from '../components/Reveal';
import StatusPill from '../components/StatusPill';
import { cores, fontes, useLayout } from '../theme';
import { useAuth } from '../store/AuthContext';
import { useOrders } from '../store/OrdersContext';
import { primeiroNome } from '../utils/format';

const CARDS = [
  { titulo: 'Empresa', icone: 'business-outline', texto: 'Manufatura aditiva que une engenharia de precisão e sustentabilidade.' },
  { titulo: 'Serviços', icone: 'print-outline', texto: 'Manufatura aditiva com impressão 3D.' },
  { titulo: 'Solução', icone: 'leaf-outline', texto: 'Redução do desperdício de material.' },
];

export default function HomeScreen({ navigation }) {
  const { esc } = useLayout();
  const { usuario } = useAuth();
  const { pedidos } = useOrders();
  const scroll = useRef(null);
  const posCards = useRef(0);

  // único movimento contínuo da tela: a impressora "flutua" no hero
  const flutua = useSharedValue(0);
  useEffect(() => {
    flutua.value = withRepeat(
      withSequence(withTiming(-9, { duration: 2000, easing: Easing.inOut(Easing.sin) }), withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.sin) })),
      -1
    );
  }, [flutua]);
  const imgAnim = useAnimatedStyle(() => ({ transform: [{ translateY: flutua.value }] }));

  const recente = pedidos[0];
  const abrirOrcamento = () => navigation.navigate('Orçamento');

  return (
    <Screen refScroll={scroll} contentStyle={{ gap: 28 }}>
      <Reveal index={0}>
        <LinearGradient colors={[cores.fundo, '#1a1d26']} style={styles.hero}>
          <Text style={styles.tag}>{usuario ? `Olá, ${primeiroNome(usuario.nome)}` : 'Hefesto'}</Text>
          <Text style={[styles.titulo, { fontSize: esc(31) }]} accessibilityRole="header">MANUFATURA</Text>
          <Animated.Image source={require('../../assets/hero.png')} resizeMode="contain" style={[styles.heroImg, { height: esc(170) }, imgAnim]} accessibilityLabel="Impressoras 3D" />
          <Text style={[styles.titulo, styles.espacado, { fontSize: esc(31) }]}>ADITIVA</Text>
          <Pressable
            onPress={() => scroll.current?.scrollTo({ y: posCards.current - 12, animated: true })}
            style={styles.saiba}
            accessibilityRole="button"
            accessibilityLabel="Saiba mais"
          >
            <View style={styles.seta}>
              <Ionicons name="arrow-down" size={20} color={cores.texto} />
            </View>
            <Text style={styles.saibaTxt}>Saiba mais</Text>
          </Pressable>
        </LinearGradient>
      </Reveal>

      {recente && (
        <Pressable onPress={() => navigation.navigate('Pedido', { id: recente.id })} accessibilityRole="button" accessibilityLabel={`Abrir solicitação ${recente.id}`}>
          <Card style={styles.recente} padding={18}>
            <View style={{ flex: 1, gap: 8 }}>
              <Text style={styles.recenteTitulo}>Última solicitação #{recente.id}</Text>
              <StatusPill status={recente.status} />
            </View>
            <Ionicons name="chevron-forward" size={20} color={cores.muted} />
          </Card>
        </Pressable>
      )}

      <View onLayout={(e) => (posCards.current = e.nativeEvent.layout.y)} style={{ gap: 14 }}>
        <Text style={styles.secao}>Hefesto</Text>
        {CARDS.map((c) => (
          <Card key={c.titulo} padding={18} style={{ gap: 12 }}>
            <View style={styles.cardTopo}>
              <View style={styles.icone}>
                <Ionicons name={c.icone} size={20} color={cores.texto} />
              </View>
              <Text style={styles.cardTitulo}>{c.titulo}</Text>
            </View>
            <Text style={styles.cardTexto}>{c.texto}</Text>
          </Card>
        ))}
      </View>

      <View style={styles.cta}>
        <Text style={[styles.ctaTitulo, { fontSize: esc(22) }]}>Começar a imprimir</Text>
        <Text style={styles.cardTexto}>Envie seu modelo 3D e receba o orçamento no app.</Text>
        <Button titulo="Orçamento" onPress={abrirOrcamento} style={{ alignSelf: 'stretch' }} />
        <Button titulo="Ver materiais" variante="secundario" onPress={() => navigation.navigate('Materiais')} style={{ alignSelf: 'stretch' }} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', paddingVertical: 28, paddingHorizontal: 12, borderRadius: 24, borderWidth: 1, borderColor: cores.borda },
  tag: { color: cores.muted, fontFamily: fontes.krona, fontSize: 12, marginBottom: 6 },
  titulo: { color: cores.texto, fontFamily: fontes.krona, textAlign: 'center' },
  espacado: { letterSpacing: 8, marginTop: 2 },
  heroImg: { width: '88%', marginVertical: 2 },
  saiba: { alignItems: 'center', gap: 8, marginTop: 20 },
  seta: { width: 40, height: 40, borderRadius: 20, backgroundColor: cores.card, alignItems: 'center', justifyContent: 'center' },
  saibaTxt: { color: cores.texto, fontFamily: fontes.krona, fontSize: 12 },
  recente: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  recenteTitulo: { color: cores.texto, fontFamily: fontes.krona, fontSize: 13 },
  secao: { color: cores.texto, fontFamily: fontes.krona, fontSize: 22 },
  cardTopo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icone: { width: 40, height: 40, borderRadius: 12, backgroundColor: cores.controle, alignItems: 'center', justifyContent: 'center' },
  cardTitulo: { color: cores.texto, fontFamily: fontes.krona, fontSize: 16 },
  cardTexto: { color: cores.textoSuave, fontSize: 14, lineHeight: 21 },
  cta: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 24, padding: 22, gap: 14 },
  ctaTitulo: { color: cores.texto, fontFamily: fontes.krona },
});
