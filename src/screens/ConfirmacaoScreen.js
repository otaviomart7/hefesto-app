import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withDelay, withSpring } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import Button from '../components/Button';
import { cores, fontes, useLayout } from '../theme';

export default function ConfirmacaoScreen({ navigation, route }) {
  const { esc } = useLayout();
  const { id, email } = route.params;
  const anel = useSharedValue(0);
  const check = useSharedValue(0);

  useEffect(() => {
    anel.value = withSpring(1, { damping: 11, stiffness: 120 });
    check.value = withDelay(260, withSpring(1, { damping: 9, stiffness: 160 }));
  }, [anel, check]);

  const anelStyle = useAnimatedStyle(() => ({ opacity: anel.value, transform: [{ scale: 0.5 + anel.value * 0.5 }] }));
  const checkStyle = useAnimatedStyle(() => ({ opacity: check.value, transform: [{ scale: check.value }] }));

  return (
    <Screen voltar carrinho={false} contentStyle={{ alignItems: 'center', gap: 16, paddingTop: 24 }}>
      <Animated.View style={[styles.anel, anelStyle]}>
        <Animated.View style={checkStyle}>
          <Ionicons name="checkmark" size={52} color={cores.fundo} />
        </Animated.View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(380).duration(420)} style={{ alignItems: 'center', gap: 10 }}>
        <Text style={[styles.titulo, { fontSize: esc(26) }]} accessibilityRole="header">Solicitação enviada</Text>
        <Text style={styles.id}>Solicitação #{id}</Text>
        <Text style={styles.texto}>
          Recebemos o seu pedido{email ? ` e vamos responder em ${email}` : ''}. O orçamento chega assim que a geometria do modelo for validada, e você é avisado aqui no app.
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(520).duration(420)} style={{ alignSelf: 'stretch', gap: 12, marginTop: 12 }}>
        <Button titulo="Acompanhar solicitação" onPress={() => navigation.reset({ index: 1, routes: [{ name: 'Main', params: { screen: 'Início' } }, { name: 'Pedido', params: { id } }] })} />
        <Button titulo="Voltar ao início" variante="secundario" onPress={() => navigation.navigate('Main', { screen: 'Início' })} />
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  anel: { width: 104, height: 104, borderRadius: 52, backgroundColor: cores.sucesso, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  titulo: { color: cores.texto, fontFamily: fontes.krona, textAlign: 'center' },
  id: { color: cores.textoSuave, fontFamily: fontes.krona, fontSize: 15 },
  texto: { color: cores.muted, fontSize: 14.5, lineHeight: 22, textAlign: 'center', maxWidth: 420 },
});
