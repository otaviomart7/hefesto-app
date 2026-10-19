import { useEffect, useState } from 'react';
import { Text } from 'react-native';
import Screen from '../components/Screen';
import Titulo from '../components/Titulo';
import Card from '../components/Card';
import Field from '../components/Field';
import Button from '../components/Button';
import Accordion from '../components/Accordion';
import Reveal from '../components/Reveal';
import { cores, fontes } from '../theme';
import { useAuth } from '../store/AuthContext';
import { useToast } from '../store/ToastContext';
import { emailValido, preenchido } from '../utils/validators';

const PERGUNTAS = [
  { pergunta: 'Quais formatos de arquivo vocês aceitam?', resposta: 'STL, OBJ e STEP. O sistema valida a geometria antes de gerar o orçamento.' },
  { pergunta: 'Existe quantidade mínima?', resposta: 'Não. Fazemos desde uma única peça até pequenos lotes.' },
  { pergunta: 'Como funciona a logística reversa?', resposta: 'Você nos envia sobras plásticas e carretéis vazios e recebe créditos para abater nos próximos orçamentos.' },
  { pergunta: 'Qual a diferença entre a linha virgem e a Eco-Tech?', resposta: 'A Eco-Tech é feita de material reprocessado internamente, com custo por grama menor e resistência técnica certificada.' },
];

export default function ContatoScreen() {
  const { usuario } = useAuth();
  const { notificar } = useToast();
  const [form, setForm] = useState({ nome: '', email: '', mensagem: '' });
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (usuario) setForm((f) => ({ ...f, nome: f.nome || usuario.nome, email: f.email || usuario.email }));
  }, [usuario]);

  const set = (k) => (v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (erros[k]) setErros((e) => ({ ...e, [k]: undefined }));
  };

  const enviar = async () => {
    const e = {};
    if (!preenchido(form.nome)) e.nome = 'Informe o seu nome.';
    if (!preenchido(form.email)) e.email = 'Informe o e-mail.';
    else if (!emailValido(form.email)) e.email = 'Use um e-mail válido, como nome@empresa.com.';
    if (!preenchido(form.mensagem)) e.mensagem = 'Escreva a sua mensagem.';
    setErros(e);
    if (Object.keys(e).length) return;
    setEnviando(true);
    await new Promise((r) => setTimeout(r, 800)); // simula o envio
    setEnviando(false);
    setForm((f) => ({ ...f, mensagem: '' }));
    notificar('Mensagem enviada', 'Nossa equipe responde por e-mail em breve.', 'sucesso');
  };

  return (
    <Screen>
      <Reveal index={0}>
        <Titulo titulo="Contato" descricao="Dúvidas sobre materiais, prazos ou um pedido? Fale com a gente." />
      </Reveal>

      <Reveal index={1}>
        <Card style={{ gap: 18 }}>
          <Field rotulo="Nome" placeholder="Nome" value={form.nome} onChangeText={set('nome')} erro={erros.nome} autoCapitalize="words" />
          <Field rotulo="E-mail" placeholder="E-mail" value={form.email} onChangeText={set('email')} erro={erros.email} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
          <Field rotulo="Mensagem" placeholder="Mensagem" value={form.mensagem} onChangeText={set('mensagem')} erro={erros.mensagem} multiline />
          <Button titulo="Enviar" onPress={enviar} carregando={enviando} />
        </Card>
      </Reveal>

      <Reveal index={2}>
        <Card style={{ gap: 16 }}>
          <Text style={{ color: cores.texto, fontFamily: fontes.krona, fontSize: 20 }} accessibilityRole="header">Perguntas frequentes</Text>
          <Accordion itens={PERGUNTAS} />
        </Card>
      </Reveal>
    </Screen>
  );
}
