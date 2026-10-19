import { useMemo, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import Screen from '../components/Screen';
import Titulo from '../components/Titulo';
import Card from '../components/Card';
import Button from '../components/Button';
import Reveal from '../components/Reveal';
import Stepper from '../components/Stepper';
import SelectField from '../components/SelectField';
import EmptyState from '../components/EmptyState';
import { cores, fontes, raios, useLayout } from '../theme';
import { buscarMaterial, ehResina, materiais, precoUnidade, ROTULO_LINHA } from '../data/catalogo';
import { formatarPreco, formatarPrecoGrama } from '../utils/format';
import { useCarrinho } from '../store/CartContext';
import { useToast } from '../store/ToastContext';

const OPCOES_MATERIAL = materiais.map((m) => ({ valor: m.id, rotulo: m.nome, sub: ROTULO_LINHA[m.linha] }));

export default function DetalhesScreen({ navigation, route }) {
  const { esc } = useLayout();
  const { adicionar } = useCarrinho();
  const { notificar } = useToast();
  const [materialId, setMaterialId] = useState(route.params?.id);
  const material = buscarMaterial(materialId);
  const [cor, setCor] = useState(material?.cores[0].nome);
  const [qtd, setQtd] = useState(1);
  const pulso = useSharedValue(1);

  const opcoesCor = useMemo(() => material?.cores.map((c) => ({ valor: c.nome, rotulo: c.nome, hex: c.hex })) ?? [], [material]);
  const precoAnim = useAnimatedStyle(() => ({ transform: [{ scale: pulso.value }] }));

  if (!material) {
    return (
      <Screen voltar>
        <EmptyState titulo="Material não encontrado" texto="Volte ao catálogo e escolha outro material." acao="Ver materiais" onAcao={() => navigation.navigate('Main', { screen: 'Materiais' })} />
      </Screen>
    );
  }

  const unidade = ehResina(material) ? 'Frasco de 1 kg' : 'Carretel de 1 kg';
  const total = precoUnidade(material) * qtd;

  const trocarMaterial = (id) => {
    const m = buscarMaterial(id);
    setMaterialId(id);
    setCor(m.cores[0].nome);
  };

  const alterarQtd = (v) => {
    setQtd(v);
    pulso.value = withSequence(withTiming(1.06, { duration: 90 }), withSpring(1, { damping: 12 }));
  };

  const adicionarAoCarrinho = () => {
    adicionar({ id: material.id, nome: material.nome, cor, qtd, preco: precoUnidade(material) });
    notificar('Adicionado ao carrinho', `${qtd} × ${material.nome} (${cor})`, 'sucesso');
  };

  const solicitar = () => navigation.navigate('Main', { screen: 'Orçamento', params: { materialId: material.id, cor, quantidade: qtd, t: Date.now() } });

  const specs = [
    ['Linha', ROTULO_LINHA[material.linha] ?? material.linha],
    ['Preço por grama', formatarPrecoGrama(material.precoGrama).replace(' / g', '')],
    ['Venda', unidade],
    ['Cores disponíveis', String(material.cores.length)],
  ];

  return (
    <Screen voltar>
      <Reveal index={0}>
        <Card padding={12} style={{ alignItems: 'center' }}>
          <View style={styles.imagem}>
            <Image source={require('../../assets/filamentos.png')} style={{ width: '100%', height: esc(240) }} resizeMode="contain" accessibilityLabel={material.nome} />
          </View>
        </Card>
      </Reveal>

      <Reveal index={1}>
        <Titulo titulo={material.nome} tamanho={24} />
        <Text style={styles.descricao}>{material.descricao}</Text>
      </Reveal>

      <Reveal index={2}>
        <Card style={{ gap: 0 }}>
          {specs.map(([k, v], i) => (
            <View key={k} style={[styles.spec, i > 0 && styles.specBorda]}>
              <Text style={styles.specK}>{k}</Text>
              <Text style={styles.specV}>{v}</Text>
            </View>
          ))}
        </Card>
      </Reveal>

      <Reveal index={3} style={{ gap: 16 }}>
        <SelectField rotulo="Material" valor={materialId} opcoes={OPCOES_MATERIAL} onChange={trocarMaterial} buscavel />
        <SelectField rotulo="Cor" valor={cor} opcoes={opcoesCor} onChange={setCor} />
        <View style={styles.qtd}>
          <Text style={styles.rotulo}>Qtd ({unidade.toLowerCase()})</Text>
          <Stepper valor={qtd} onChange={alterarQtd} />
        </View>
      </Reveal>

      <Reveal index={4} style={{ gap: 14 }}>
        <Animated.Text style={[styles.preco, { fontSize: esc(26) }, precoAnim]} accessibilityLabel={`Total ${formatarPreco(total)}`}>
          {formatarPreco(total)}
        </Animated.Text>
        <Button titulo="Adicionar ao carrinho" onPress={adicionarAoCarrinho} />
        <Button titulo="Solicitar orçamento" variante="secundario" onPress={solicitar} />
      </Reveal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  imagem: { width: '100%', backgroundColor: cores.controle, borderRadius: raios.controle, padding: 12, overflow: 'hidden' },
  descricao: { color: cores.textoSuave, fontSize: 14.5, lineHeight: 22, marginTop: 6 },
  spec: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12, minHeight: 42, paddingVertical: 10 },
  specBorda: { borderTopWidth: 1, borderTopColor: cores.borda },
  specK: { color: cores.muted, fontFamily: fontes.krona, fontSize: 11 },
  specV: { flexShrink: 1, color: cores.texto, fontFamily: fontes.krona, fontSize: 11, textAlign: 'right' },
  qtd: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, minHeight: 48 },
  rotulo: { flex: 1, color: cores.texto, fontFamily: fontes.krona, fontSize: 12 },
  preco: { color: cores.texto, fontFamily: fontes.krona, alignSelf: 'flex-start' },
});
