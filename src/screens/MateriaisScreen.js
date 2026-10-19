import { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import Titulo from '../components/Titulo';
import Card from '../components/Card';
import Button from '../components/Button';
import Reveal from '../components/Reveal';
import ColorDots from '../components/ColorDots';
import SelectField from '../components/SelectField';
import EmptyState from '../components/EmptyState';
import { cores, fontes, raios } from '../theme';
import { LINHAS, materiais, ROTULO_LINHA, todasCores } from '../data/catalogo';
import { formatarPrecoGrama } from '../utils/format';

const POR_PAGINA = 20;
const OPCOES_COR = [{ valor: '', rotulo: 'Qualquer cor' }, ...todasCores.map((c) => ({ valor: c, rotulo: c }))];

export default function MateriaisScreen({ navigation }) {
  const [busca, setBusca] = useState('');
  const [linha, setLinha] = useState('todas');
  const [cor, setCor] = useState('');
  const [limite, setLimite] = useState(POR_PAGINA);

  const filtrados = useMemo(
    () =>
      materiais.filter((m) => {
        if (linha !== 'todas' && m.linha !== linha) return false;
        if (cor && !m.cores.some((c) => c.nome === cor)) return false;
        return m.nome.toLowerCase().includes(busca.trim().toLowerCase());
      }),
    [busca, linha, cor]
  );

  const mudar = (fn) => (v) => {
    fn(v);
    setLimite(POR_PAGINA);
  };

  return (
    <Screen>
      <Reveal index={0}>
        <Titulo titulo="Materiais" descricao="Filamentos e resinas para qualquer tipo de impressão." />
      </Reveal>

      <Reveal index={1}>
        <Card style={styles.banner} padding={16}>
          <View style={{ flex: 1, gap: 10 }}>
            <Text style={styles.bannerTitulo}>Impressão</Text>
            <Text style={styles.bannerTxt}>Envie seu modelo para impressão nas melhores impressoras.</Text>
            <Button titulo="Solicitar orçamento" onPress={() => navigation.navigate('Orçamento')} style={{ height: 46 }} />
          </View>
          <Image source={require('../../assets/impressora.png')} style={styles.bannerImg} resizeMode="contain" accessibilityLabel="Impressora 3D" />
        </Card>
      </Reveal>

      <Reveal index={2} style={{ gap: 14 }}>
        <View style={styles.busca}>
          <Ionicons name="search" size={18} color={cores.muted} />
          <TextInput
            value={busca}
            onChangeText={mudar(setBusca)}
            placeholder="Buscar material"
            placeholderTextColor={cores.muted}
            style={styles.buscaInput}
            autoCorrect={false}
            accessibilityLabel="Buscar material"
            returnKeyType="search"
          />
          {!!busca && (
            <Pressable onPress={() => mudar(setBusca)('')} hitSlop={10} accessibilityLabel="Limpar busca">
              <Ionicons name="close-circle" size={18} color={cores.muted} />
            </Pressable>
          )}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }} style={{ marginHorizontal: -20 }}>
          <View style={{ width: 12 }} />
          {LINHAS.map((l) => {
            const sel = l.id === linha;
            return (
              <Pressable key={l.id} onPress={() => mudar(setLinha)(l.id)} style={[styles.chip, sel && styles.chipSel]} accessibilityRole="button" accessibilityState={{ selected: sel }}>
                <Text style={[styles.chipTxt, sel && { color: cores.fundo }]}>{l.rotulo}</Text>
              </Pressable>
            );
          })}
          <View style={{ width: 12 }} />
        </ScrollView>

        <SelectField rotulo="Cor" valor={cor} opcoes={OPCOES_COR} onChange={mudar(setCor)} buscavel />
      </Reveal>

      <Text style={styles.contagem} accessibilityLiveRegion="polite">
        {filtrados.length} {filtrados.length === 1 ? 'material' : 'materiais'}
      </Text>

      <View style={{ gap: 12 }}>
        {filtrados.slice(0, limite).map((m, i) => (
          <Animated.View key={m.id} entering={i < 8 ? FadeIn.delay(i * 40).duration(300) : undefined} layout={LinearTransition.duration(200)}>
            <Pressable onPress={() => navigation.navigate('Detalhes', { id: m.id })} accessibilityRole="button" accessibilityLabel={`${m.nome}, ${formatarPrecoGrama(m.precoGrama)}`}>
              {({ pressed }) => (
                <View style={[styles.item, pressed && { backgroundColor: cores.controle }]}>
                  <View style={{ flex: 1, gap: 10 }}>
                    <Text style={styles.itemNome}>{m.nome}</Text>
                    <View style={styles.tagBox}>
                      <Text style={styles.tag}>{ROTULO_LINHA[m.linha] ?? m.linha}</Text>
                    </View>
                    <ColorDots cores={m.cores} max={8} />
                    <Text style={styles.preco}>{formatarPrecoGrama(m.precoGrama)}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={cores.muted} />
                </View>
              )}
            </Pressable>
          </Animated.View>
        ))}
        {filtrados.length === 0 && <EmptyState icone="search-outline" titulo="Nenhum material encontrado" texto="Ajuste a busca ou limpe os filtros para ver mais opções." acao="Limpar filtros" onAcao={() => { setBusca(''); setLinha('todas'); setCor(''); }} />}
        {filtrados.length > limite && <Button titulo={`Mostrar mais (${filtrados.length - limite})`} variante="secundario" onPress={() => setLimite((l) => l + POR_PAGINA)} />}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  banner: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  bannerTitulo: { color: cores.texto, fontFamily: fontes.krona, fontSize: 18 },
  bannerTxt: { color: cores.textoSuave, fontSize: 13.5, lineHeight: 20 },
  bannerImg: { width: 92, height: 140 },
  busca: { flexDirection: 'row', alignItems: 'center', gap: 10, height: 54, paddingHorizontal: 16, backgroundColor: cores.controle, borderRadius: raios.controle },
  buscaInput: { flex: 1, color: cores.texto, fontFamily: fontes.krona, fontSize: 13 },
  chip: { paddingHorizontal: 16, height: 38, borderRadius: 19, backgroundColor: cores.card, alignItems: 'center', justifyContent: 'center' },
  chipSel: { backgroundColor: cores.texto },
  chipTxt: { color: cores.textoSuave, fontFamily: fontes.krona, fontSize: 11 },
  contagem: { color: cores.muted, fontFamily: fontes.krona, fontSize: 11 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 20, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: raios.card },
  itemNome: { color: cores.texto, fontFamily: fontes.krona, fontSize: 14, lineHeight: 21 },
  tagBox: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 3, borderRadius: 999, backgroundColor: cores.controle },
  tag: { color: cores.texto, fontFamily: fontes.krona, fontSize: 10 },
  preco: { color: cores.textoSuave, fontSize: 14 },
});
