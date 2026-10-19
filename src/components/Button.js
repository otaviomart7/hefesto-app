import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { cores, fontes, raios } from '../theme';

const APressable = Animated.createAnimatedComponent(Pressable);

// Botão do Figma: 56 px, raio 12. Primário branco, secundário #2d2f38.
export default function Button({ titulo, onPress, variante = 'primario', carregando = false, desabilitado = false, style, leftIcon }) {
  const escala = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: escala.value }] }));
  const primario = variante === 'primario';
  const inativo = desabilitado || carregando;

  return (
    <APressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inativo, busy: carregando }}
      disabled={inativo}
      onPress={onPress}
      onPressIn={() => (escala.value = withTiming(0.97, { duration: 90 }))}
      onPressOut={() => (escala.value = withSpring(1, { damping: 14, stiffness: 260 }))}
      style={[
        styles.base,
        primario ? styles.primario : variante === 'contorno' ? styles.contorno : styles.secundario,
        inativo && { opacity: 0.55 },
        anim,
        style,
      ]}
    >
      {carregando ? (
        <ActivityIndicator color={primario ? cores.fundo : cores.texto} />
      ) : (
        <>
          {leftIcon}
          <Text style={[styles.texto, { color: primario ? cores.fundo : cores.texto }]}>{titulo}</Text>
        </>
      )}
    </APressable>
  );
}

const styles = StyleSheet.create({
  base: { height: 56, borderRadius: raios.controle, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10, paddingHorizontal: 20 },
  primario: { backgroundColor: cores.texto },
  secundario: { backgroundColor: cores.controle },
  contorno: { backgroundColor: 'transparent', borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)' },
  texto: { fontFamily: fontes.krona, fontSize: 14 },
});
