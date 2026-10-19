import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, FadeIn, useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { cores, fontes, useLayout } from '../theme';
import { useAuth } from '../store/AuthContext';

const DURACAO_MIN = 2200;

export default function SplashScreen({ navigation }) {
  const { esc } = useLayout();
  const { usuario, carregando } = useAuth();
  const [tempoOk, setTempoOk] = useState(false);
  const saiu = useRef(false);

  const escala = useSharedValue(0.78);
  const opac = useSharedValue(0);
  const barra = useSharedValue(0);

  useEffect(() => {
    opac.value = withTiming(1, { duration: 700 });
    escala.value = withSpring(1, { damping: 13, stiffness: 90 });
    barra.value = withDelay(250, withTiming(1, { duration: DURACAO_MIN - 400, easing: Easing.inOut(Easing.cubic) }));
    const t = setTimeout(() => setTempoOk(true), DURACAO_MIN);
    return () => clearTimeout(t);
  }, [barra, escala, opac]);

  useEffect(() => {
    if (tempoOk && !carregando && !saiu.current) {
      saiu.current = true;
      navigation.reset({ index: 0, routes: [usuario ? { name: 'Main' } : { name: 'Auth' }] });
    }
  }, [tempoOk, carregando, usuario, navigation]);

  const logo = useAnimatedStyle(() => ({ opacity: opac.value, transform: [{ scale: escala.value }] }));
  const preenchimento = useAnimatedStyle(() => ({ width: `${barra.value * 100}%` }));

  return (
    <View style={styles.raiz}>
      <StatusBar style="light" />
      <Animated.Image source={require('../../assets/logo.png')} resizeMode="contain" style={[{ width: esc(190), height: esc(190) }, logo]} accessibilityLabel="Logotipo Hefesto" />
      <Animated.View entering={FadeIn.delay(650).duration(700)} style={styles.textos}>
        <Text style={[styles.marca, { fontSize: esc(28) }]}>Hefesto</Text>
        <Text style={styles.sub}>Manufatura Aditiva</Text>
      </Animated.View>
      <View style={styles.trilho}>
        <Animated.View style={[styles.barra, preenchimento]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: cores.fundo, alignItems: 'center', justifyContent: 'center', gap: 8 },
  textos: { alignItems: 'center', gap: 6, marginTop: 4 },
  marca: { color: cores.texto, fontFamily: fontes.krona },
  sub: { color: cores.muted, fontFamily: fontes.krona, fontSize: 12 },
  trilho: { position: 'absolute', bottom: 72, width: 120, height: 3, borderRadius: 2, backgroundColor: cores.controle, overflow: 'hidden' },
  barra: { height: '100%', backgroundColor: cores.destaque },
});
