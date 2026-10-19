import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import Titulo from '../components/Titulo';
import Card from '../components/Card';
import Field from '../components/Field';
import SelectField from '../components/SelectField';
import Button from '../components/Button';
import Reveal from '../components/Reveal';
import AuthGate from '../components/AuthGate';
import { cores, fontes } from '../theme';
import { buscarMaterial, materiais, ROTULO_LINHA, servicos } from '../data/catalogo';
import { useAuth } from '../store/AuthContext';
import { useCarrinho } from '../store/CartContext';
import { useOrders } from '../store/OrdersContext';
import { useToast } from '../store/ToastContext';
import { arquivo3DValido, emailValido, mascararTelefone, preenchido, telefoneValido } from '../utils/validators';
import { formatarPreco } from '../utils/format';

const OPC_SERVICO = servicos.map((s) => ({ valor: s, rotulo: s }));
const OPC_MATERIAL = materiais.map((m) => ({ valor: m.id, rotulo: m.nome, sub: ROTULO_LINHA[m.linha] }));
const VAZIO = { nome: '', empresa: '', email: '', telefone: '', quantidade: '1', mensagem: '' };

const tamanho = (b) => (b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);

export default function OrcamentoScreen({ navigation, route }) {
  const { usuario, atualizarPerfil } = useAuth();
  const { itens, total, limpar } = useCarrinho();
  const { criar } = useOrders();
  const { notificar } = useToast();

  const [form, setForm] = useState(VAZIO);
  const [servico, setServico] = useState(servicos[0]);
  const [materialId, setMaterialId] = useState(materiais[0].id);
  const [cor, setCor] = useState(materiais[0].cores[0].nome);
  const [arquivo, setArquivo] = useState(null);
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);

  const material = buscarMaterial(materialId);
  const opcoesCor = useMemo(() => material.cores.map((c) => ({ valor: c.nome, rotulo: c.nome, hex: c.hex })), [material]);

  // dados do cliente logado (RN001)
  useEffect(() => {
    if (usuario) {
      setForm((f) => ({
        ...f,
        nome: f.nome || usuario.nome,
        email: f.email || usuario.email,
        empresa: f.empresa || usuario.empresa || '',
        telefone: f.telefone || usuario.telefone || '',
      }));
    }
  }, [usuario]);

  // vindo da tela de detalhes do material
  useEffect(() => {
    const p = route.params;
    if (p?.materialId && buscarMaterial(p.materialId)) {
      const m = buscarMaterial(p.materialId);
      setMaterialId(m.id);
      setCor(m.cores.some((c) => c.nome === p.cor) ? p.cor : m.cores[0].nome);
      if (p.quantidade) setForm((f) => ({ ...f, quantidade: String(p.quantidade) }));
    }
  }, [route.params?.t]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (k) => (v) => {
    setForm((f) => ({ ...f, [k]: k === 'telefone' ? mascararTelefone(v) : k === 'quantidade' ? v.replace(/\D/g, '').slice(0, 5) : v }));
    if (erros[k]) setErros((e) => ({ ...e, [k]: undefined }));
  };

  const trocarMaterial = (id) => {
    const m = buscarMaterial(id);
    setMaterialId(id);
    setCor(m.cores[0].nome);
  };

  const escolherArquivo = async () => {
    try {
      const r = await DocumentPicker.getDocumentAsync({ type: '*/*', copyToCacheDirectory: true });
      if (r.canceled) return;
      const a = r.assets[0];
      if (!arquivo3DValido(a.name)) {
        setArquivo(null);
        setErros((e) => ({ ...e, arquivo: 'Formato não aceito. Envie um arquivo .STL, .OBJ ou .STEP.' }));
        return;
      }
      setArquivo({ name: a.name, size: a.size ?? 0, uri: a.uri });
      setErros((e) => ({ ...e, arquivo: undefined }));
    } catch {
      setErros((e) => ({ ...e, arquivo: 'Não foi possível abrir o arquivo. Tente novamente.' }));
    }
  };

  const validar = () => {
    const e = {};
    // RN009 — obrigatórios não podem ir vazios; RN003 — produto/serviço, quantidade e contato
    if (!preenchido(form.nome)) e.nome = 'Informe o seu nome.';
    if (!preenchido(form.email)) e.email = 'Informe o e-mail.';
    else if (!emailValido(form.email)) e.email = 'Use um e-mail válido, como nome@empresa.com.';
    if (!telefoneValido(form.telefone)) e.telefone = 'Informe o telefone com DDD.';
    if (!(parseInt(form.quantidade, 10) >= 1)) e.quantidade = 'A quantidade mínima é 1.';
    if (!arquivo) e.arquivo = 'Anexe o modelo 3D (.STL, .OBJ ou .STEP).';
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const enviar = async () => {
    if (!validar()) {
      notificar('Revise os campos', 'Alguns campos precisam de atenção.', 'erro');
      return;
    }
    setEnviando(true);
    await new Promise((r) => setTimeout(r, 700)); // simula o envio ao servidor
    const id = criar({
      nome: form.nome.trim(),
      empresa: form.empresa.trim(),
      email: form.email.trim().toLowerCase(),
      telefone: form.telefone,
      servico,
      materialId,
      materialNome: material.nome,
      cor,
      quantidade: parseInt(form.quantidade, 10),
      arquivo: arquivo.name,
      mensagem: form.mensagem.trim(),
      itens,
      itensTotal: total,
    });
    atualizarPerfil({ email: usuario.email, empresa: form.empresa.trim(), telefone: form.telefone });
    limpar();
    setForm({ ...VAZIO, nome: usuario.nome, email: usuario.email, empresa: form.empresa, telefone: form.telefone });
    setArquivo(null);
    setErros({});
    setEnviando(false);
    navigation.navigate('Confirmacao', { id, email: form.email.trim().toLowerCase() });
  };

  return (
    <Screen>
      <Reveal index={0}>
        <Titulo tamanho={26} titulo="Solicitação de orçamento" descricao="Envie seu modelo 3D e acompanhe o orçamento aqui no app." />
      </Reveal>

      {!usuario ? (
        <Reveal index={1}>
          <AuthGate retorno="Orçamento" titulo="Cadastro necessário" texto="Para solicitar um orçamento é preciso ter conta. Assim conseguimos identificar você e acompanhar a solicitação." />
        </Reveal>
      ) : (
        <Reveal index={1}>
          <Card style={{ gap: 18 }}>
            {itens.length > 0 && (
              <Animated.View entering={FadeIn} style={styles.aviso}>
                <Ionicons name="cart" size={18} color={cores.destaque} />
                <Text style={styles.avisoTxt}>
                  {itens.length} {itens.length === 1 ? 'item' : 'itens'} do carrinho ({formatarPreco(total)}) serão incluídos.
                </Text>
              </Animated.View>
            )}

            <Field rotulo="Nome" placeholder="Nome" value={form.nome} onChangeText={set('nome')} erro={erros.nome} autoCapitalize="words" autoComplete="name" />
            <Field rotulo="Empresa" placeholder="Empresa" value={form.empresa} onChangeText={set('empresa')} autoCapitalize="words" autoComplete="organization" />
            <Field rotulo="E-mail" placeholder="E-mail" value={form.email} onChangeText={set('email')} erro={erros.email} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email" />
            <Field rotulo="Telefone" placeholder="(00) 00000-0000" value={form.telefone} onChangeText={set('telefone')} erro={erros.telefone} keyboardType="phone-pad" autoComplete="tel" />
            <SelectField rotulo="Serviço" valor={servico} opcoes={OPC_SERVICO} onChange={setServico} buscavel />
            <SelectField rotulo="Material" valor={materialId} opcoes={OPC_MATERIAL} onChange={trocarMaterial} buscavel />
            <SelectField rotulo="Cor" valor={cor} opcoes={opcoesCor} onChange={setCor} />
            <Field rotulo="Quantidade" placeholder="Quantidade" value={form.quantidade} onChangeText={set('quantidade')} erro={erros.quantidade} keyboardType="number-pad" />

            <View style={{ gap: 8 }}>
              <Pressable onPress={escolherArquivo} style={[styles.upload, erros.arquivo && { borderColor: cores.erro }]} accessibilityRole="button" accessibilityLabel="Anexar modelo 3D">
                <Ionicons name={arquivo ? 'document-attach' : 'cloud-upload-outline'} size={30} color={cores.texto} />
                {arquivo ? (
                  <Animated.View entering={FadeIn} layout={LinearTransition} style={{ alignItems: 'center', gap: 4 }}>
                    <Text style={styles.uploadNome} numberOfLines={1}>{arquivo.name}</Text>
                    <Text style={styles.uploadSub}>{tamanho(arquivo.size)} · toque para trocar</Text>
                  </Animated.View>
                ) : (
                  <>
                    <Text style={styles.uploadTxt}>.STL/.OBJ/.STEP</Text>
                    <Text style={styles.uploadSub}>Toque para escolher o arquivo</Text>
                  </>
                )}
              </Pressable>
              {!!erros.arquivo && <Text style={styles.erro}>{erros.arquivo}</Text>}
            </View>

            <Field rotulo="Mensagem" placeholder="Mensagem" value={form.mensagem} onChangeText={set('mensagem')} multiline />
            <Button titulo="Enviar solicitação" onPress={enviar} carregando={enviando} />
          </Card>
        </Reveal>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  aviso: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 12, backgroundColor: 'rgba(41,182,246,0.12)' },
  avisoTxt: { flex: 1, color: cores.textoSuave, fontSize: 13, lineHeight: 18 },
  upload: { minHeight: 147, alignItems: 'center', justifyContent: 'center', gap: 10, padding: 20, borderRadius: 16, borderWidth: 2, borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.35)' },
  uploadTxt: { color: cores.texto, fontFamily: fontes.krona, fontSize: 13 },
  uploadNome: { color: cores.texto, fontFamily: fontes.krona, fontSize: 12, maxWidth: 260 },
  uploadSub: { color: cores.muted, fontSize: 12.5 },
  erro: { color: cores.erro, fontSize: 12.5, lineHeight: 17 },
});
