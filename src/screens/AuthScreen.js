import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import Screen from '../components/Screen';
import Titulo from '../components/Titulo';
import Tabs from '../components/Tabs';
import Card from '../components/Card';
import Field from '../components/Field';
import Button from '../components/Button';
import Reveal from '../components/Reveal';
import { cores, fontes, useLayout } from '../theme';
import { useAuth } from '../store/AuthContext';
import { emailValido, preenchido } from '../utils/validators';
import { avisar } from '../utils/dialogos';

const ABAS = [
  { id: 'entrar', rotulo: 'Entrar' },
  { id: 'cadastrar', rotulo: 'Cadastrar' },
];

export default function AuthScreen({ navigation, route }) {
  const { esc } = useLayout();
  const { entrar, cadastrar, recuperarSenha } = useAuth();
  const retorno = route.params?.retorno ?? 'Início';
  const [aba, setAba] = useState(route.params?.aba ?? 'entrar');
  const [form, setForm] = useState({ nome: '', email: '', senha: '' });
  const [erros, setErros] = useState({});
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (route.params?.aba) setAba(route.params.aba);
  }, [route.params?.aba]);

  const set = (k) => (v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (erros[k] || erros.geral) setErros((e) => ({ ...e, [k]: undefined, geral: undefined }));
  };

  const trocarAba = (id) => {
    setAba(id);
    setErros({});
  };

  const validar = () => {
    const e = {};
    if (aba === 'cadastrar' && !preenchido(form.nome)) e.nome = 'Informe o seu nome.';
    if (!preenchido(form.email)) e.email = 'Informe o e-mail.';
    else if (!emailValido(form.email)) e.email = 'Use um e-mail válido, como nome@empresa.com.';
    if (!preenchido(form.senha)) e.senha = 'Informe a senha.';
    else if (aba === 'cadastrar' && form.senha.length < 6) e.senha = 'A senha precisa ter ao menos 6 caracteres.';
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const concluir = () => navigation.reset({ index: 0, routes: [{ name: 'Main', params: { screen: retorno } }] });

  const enviar = async () => {
    if (!validar()) return;
    setCarregando(true);
    try {
      if (aba === 'entrar') await entrar(form.email, form.senha);
      else await cadastrar(form);
      concluir();
    } catch (err) {
      setErros({ geral: err.message });
    } finally {
      setCarregando(false);
    }
  };

  const esqueci = async () => {
    if (!emailValido(form.email)) {
      setErros({ email: 'Informe o e-mail da conta para recuperar a senha.' });
      return;
    }
    await recuperarSenha(form.email);
    avisar('Recuperação de senha', 'Se houver uma conta com esse e-mail, enviaremos as instruções para redefinir a senha.');
  };

  return (
    <Screen carrinho={false}>
      <Reveal index={0} style={styles.topo}>
        <Titulo titulo={aba === 'entrar' ? 'Entrar' : 'Cadastrar'} descricao="Manufatura Aditiva" style={{ flex: 1 }} />
        <Image source={require('../../assets/logo.png')} style={{ width: esc(105), height: esc(102) }} resizeMode="contain" accessibilityLabel="Logotipo Hefesto" />
      </Reveal>

      <Reveal index={1}>
        <Tabs abas={ABAS} ativa={aba} onChange={trocarAba} />
      </Reveal>

      <Reveal index={2}>
        <Animated.View layout={LinearTransition.duration(240)}>
          <Card padding={20} style={{ gap: 18 }}>
            {aba === 'cadastrar' && (
              <Animated.View entering={FadeIn.duration(220)} exiting={FadeOut.duration(120)}>
                <Field rotulo="Nome" placeholder="Nome" value={form.nome} onChangeText={set('nome')} erro={erros.nome} autoCapitalize="words" autoComplete="name" textContentType="name" />
              </Animated.View>
            )}
            <Field rotulo="E-mail" placeholder="E-mail" value={form.email} onChangeText={set('email')} erro={erros.email} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email" textContentType="emailAddress" />
            <Field rotulo="Senha" placeholder="Senha" value={form.senha} onChangeText={set('senha')} erro={erros.senha} senha autoCapitalize="none" autoComplete={aba === 'entrar' ? 'current-password' : 'new-password'} textContentType={aba === 'entrar' ? 'password' : 'newPassword'} onSubmitEditing={enviar} returnKeyType="go" />

            {aba === 'entrar' && (
              <Animated.View entering={FadeIn.duration(220)} exiting={FadeOut.duration(120)} style={{ alignSelf: 'flex-start' }}>
                <Text onPress={esqueci} style={styles.link} accessibilityRole="link">
                  Esqueci minha senha
                </Text>
              </Animated.View>
            )}

            {!!erros.geral && (
              <Animated.View entering={FadeIn.duration(200)}>
                <Text style={styles.erroGeral} accessibilityRole="alert">{erros.geral}</Text>
              </Animated.View>
            )}

            <Button titulo={aba === 'entrar' ? 'Entrar' : 'Criar conta'} onPress={enviar} carregando={carregando} />
          </Card>
        </Animated.View>
      </Reveal>

      <Reveal index={3}>
        <Button titulo="Explorar sem conta" variante="contorno" onPress={concluir} />
        <Text style={styles.nota}>Para solicitar orçamento e acompanhar pedidos é preciso estar cadastrado.</Text>
      </Reveal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  link: { color: cores.textoSuave, fontFamily: fontes.krona, fontSize: 12, textDecorationLine: 'underline', paddingVertical: 4 },
  erroGeral: { color: cores.erro, fontSize: 13.5, lineHeight: 19 },
  nota: { color: cores.muted, fontSize: 12.5, lineHeight: 18, textAlign: 'center', marginTop: 12 },
});
