import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, LinearTransition } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import Titulo from '../components/Titulo';
import Card from '../components/Card';
import Button from '../components/Button';
import StatusPill from '../components/StatusPill';
import Timeline from '../components/Timeline';
import EmptyState from '../components/EmptyState';
import Reveal from '../components/Reveal';
import { cores, fontes } from '../theme';
import { useOrders } from '../store/OrdersContext';
import { useToast } from '../store/ToastContext';
import { CANCELAVEIS, DESCRICAO_STATUS, ehPedido } from '../utils/status';
import { confirmar } from '../utils/dialogos';
import { formatarData, formatarPreco } from '../utils/format';

function Linha({ k, v }) {
  if (!v) return null;
  return (
    <View style={styles.linha}>
      <Text style={styles.k}>{k}</Text>
      <Text style={styles.v}>{v}</Text>
    </View>
  );
}

export default function PedidoScreen({ navigation, route }) {
  const { buscar, aprovar, recusar, cancelar } = useOrders();
  const { notificar } = useToast();
  const p = buscar(route.params.id);

  if (!p) {
    return (
      <Screen voltar>
        <EmptyState titulo="Solicitação não encontrada" texto="Ela pode ter sido removida deste aparelho." acao="Voltar" onAcao={() => navigation.goBack()} />
      </Screen>
    );
  }

  const pedido = ehPedido(p);
  const aguardando = p.status === 'Orçamento enviado';
  const podeCancelar = CANCELAVEIS.includes(p.status);

  const aoAprovar = () =>
    confirmar({
      titulo: 'Aprovar orçamento',
      mensagem: `Confirmar o valor de ${formatarPreco(p.valor)} para a solicitação #${p.id}?`,
      confirmarTxt: 'Aprovar',
      onConfirm: () => {
        aprovar(p.id);
        notificar('Orçamento aprovado', `O pedido #${p.id} entra na fila de produção.`, 'sucesso');
      },
    });

  const aoRecusar = () =>
    confirmar({
      titulo: 'Recusar orçamento',
      mensagem: 'A solicitação será encerrada. Você poderá enviar uma nova quando quiser.',
      confirmarTxt: 'Recusar',
      destrutivo: true,
      onConfirm: () => recusar(p.id),
    });

  // RN005 — cancelamento somente antes do início do atendimento
  const aoCancelar = () =>
    confirmar({
      titulo: 'Cancelar solicitação',
      mensagem: 'Essa ação não pode ser desfeita.',
      confirmarTxt: 'Cancelar solicitação',
      cancelarTxt: 'Manter',
      destrutivo: true,
      onConfirm: () => cancelar(p.id),
    });

  return (
    <Screen voltar>
      <Reveal index={0} style={{ gap: 12 }}>
        <Titulo tamanho={26} titulo={`${pedido ? 'Pedido' : 'Solicitação'} #${p.id}`} />
        <StatusPill status={p.status} />
        <Text style={styles.descStatus}>{DESCRICAO_STATUS[p.status]}</Text>
      </Reveal>

      {aguardando && (
        <Animated.View entering={FadeInDown.duration(380)}>
          <Card style={styles.destaque}>
            <View style={styles.destaqueTopo}>
              <Ionicons name="pricetag" size={20} color={cores.aviso} />
              <Text style={styles.destaqueTxt}>Orçamento disponível</Text>
            </View>
            <Text style={styles.valor}>{formatarPreco(p.valor)}</Text>
            <Text style={styles.nota}>Valor estimado com base no material, na quantidade e nos itens do carrinho. O valor final é confirmado após a validação do modelo.</Text>
            <Button titulo="Aprovar orçamento" onPress={aoAprovar} />
            <Button titulo="Recusar" variante="secundario" onPress={aoRecusar} />
          </Card>
        </Animated.View>
      )}

      {pedido && p.valor != null && (
        <Reveal index={1}>
          <Card padding={18} style={{ gap: 4 }}>
            <Text style={styles.k}>Valor aprovado</Text>
            <Text style={styles.valor}>{formatarPreco(p.valor)}</Text>
          </Card>
        </Reveal>
      )}

      <Reveal index={2}>
        <Card>
          <Text style={styles.secao}>Acompanhamento</Text>
          <Timeline pedido={p} />
        </Card>
      </Reveal>

      <Reveal index={3}>
        <Card style={{ gap: 14 }}>
          <Text style={styles.secao}>Resumo</Text>
          <Linha k="Serviço" v={p.servico} />
          <Linha k="Material" v={p.materialNome} />
          <Linha k="Cor" v={p.cor} />
          <Linha k="Quantidade" v={`${p.quantidade} un.`} />
          <Linha k="Arquivo" v={p.arquivo} />
          <Linha k="Mensagem" v={p.mensagem} />
          {p.itens?.length > 0 && <Linha k="Itens do carrinho" v={p.itens.map((i) => `${i.qtd}× ${i.nome} (${i.cor})`).join('\n')} />}
          <Linha k="Contato" v={[p.nome, p.empresa, p.email, p.telefone].filter(Boolean).join('\n')} />
          <Linha k="Enviada em" v={formatarData(p.criadoEm)} />
        </Card>
      </Reveal>

      <Animated.View layout={LinearTransition} style={{ gap: 12 }}>
        {podeCancelar && !aguardando && <Button titulo="Cancelar solicitação" variante="contorno" onPress={aoCancelar} />}
        {podeCancelar && aguardando && (
          <Animated.Text entering={FadeIn} style={styles.cancelar} onPress={aoCancelar} accessibilityRole="button">
            Cancelar solicitação
          </Animated.Text>
        )}
        <Button titulo="Falar com o suporte" variante="secundario" leftIcon={<Ionicons name="chatbubbles-outline" size={18} color={cores.texto} />} onPress={() => navigation.navigate('Main', { screen: 'Contato' })} />
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  descStatus: { color: cores.textoSuave, fontSize: 14.5, lineHeight: 22 },
  destaque: { borderWidth: 1, borderColor: 'rgba(244,196,48,0.45)', gap: 14 },
  destaqueTopo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  destaqueTxt: { color: cores.aviso, fontFamily: fontes.krona, fontSize: 12 },
  valor: { color: cores.texto, fontFamily: fontes.krona, fontSize: 26 },
  nota: { color: cores.muted, fontSize: 13, lineHeight: 19 },
  secao: { color: cores.texto, fontFamily: fontes.krona, fontSize: 16 },
  linha: { gap: 4 },
  k: { color: cores.muted, fontFamily: fontes.krona, fontSize: 11 },
  v: { color: cores.texto, fontSize: 14.5, lineHeight: 21 },
  cancelar: { color: cores.erro, fontFamily: fontes.krona, fontSize: 12, textAlign: 'center', textDecorationLine: 'underline', paddingVertical: 10 },
});
