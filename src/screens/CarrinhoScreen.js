import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOutLeft, LinearTransition } from 'react-native-reanimated';
import Screen from '../components/Screen';
import Titulo from '../components/Titulo';
import Card from '../components/Card';
import Button from '../components/Button';
import Stepper from '../components/Stepper';
import EmptyState from '../components/EmptyState';
import { cores, fontes } from '../theme';
import { useCarrinho } from '../store/CartContext';
import { formatarPreco } from '../utils/format';

export default function CarrinhoScreen({ navigation }) {
  const { itens, alterarQtd, remover, total } = useCarrinho();
  const irOrcamento = () => navigation.navigate('Main', { screen: 'Orçamento' });

  return (
    <Screen voltar carrinho={false}>
      <Titulo titulo="Carrinho" />

      {itens.length === 0 && (
        <Card>
          <EmptyState icone="cart-outline" titulo="Seu carrinho está vazio" texto="Escolha materiais no catálogo para incluir no orçamento." acao="Ver materiais" onAcao={() => navigation.navigate('Main', { screen: 'Materiais' })} />
        </Card>
      )}

      <View style={{ gap: 14 }}>
        {itens.map((item, i) => (
          <Animated.View key={item.chave} entering={FadeInDown.delay(i * 60).duration(350)} exiting={FadeOutLeft.duration(220)} layout={LinearTransition.duration(220)}>
            <Card style={{ gap: 14 }}>
              <View style={{ gap: 4 }}>
                <Text style={styles.nome}>{item.nome}</Text>
                <Text style={styles.det}>{item.cor} · {formatarPreco(item.preco)} / unidade de 1 kg</Text>
              </View>
              <View style={styles.acoes}>
                <Stepper valor={item.qtd} onChange={(v) => alterarQtd(item.chave, v)} />
                <Pressable onPress={() => remover(item.chave)} hitSlop={10} accessibilityRole="button" accessibilityLabel={`Remover ${item.nome}`}>
                  <Text style={styles.remover}>Remover</Text>
                </Pressable>
              </View>
            </Card>
          </Animated.View>
        ))}
      </View>

      {itens.length > 0 && (
        <Animated.View entering={FadeInDown.delay(150).duration(350)} layout={LinearTransition.duration(220)}>
          <Card style={{ gap: 18 }}>
            <View style={styles.total}>
              <Text style={styles.totalRotulo}>Total estimado:</Text>
              <Text style={styles.totalValor}>{formatarPreco(total)}</Text>
            </View>
            <Button titulo="Solicitar orçamento" onPress={irOrcamento} />
          </Card>
        </Animated.View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  nome: { color: cores.texto, fontFamily: fontes.krona, fontSize: 15, lineHeight: 22 },
  det: { color: cores.muted, fontSize: 13.5, lineHeight: 19 },
  acoes: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  remover: { color: cores.textoSuave, fontFamily: fontes.krona, fontSize: 12, textDecorationLine: 'underline' },
  total: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  totalRotulo: { color: cores.muted, fontFamily: fontes.krona, fontSize: 12 },
  totalValor: { color: cores.texto, fontFamily: fontes.krona, fontSize: 20 },
});
