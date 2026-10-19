import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { cores, fontes, raios } from '../theme';

// Campo do Figma: rótulo 12 px + controle #2d2f38 (raio 12, 54 px)
export default function Field({ rotulo, erro, senha = false, multiline = false, style, ...props }) {
  const [focado, setFocado] = useState(false);
  const [ver, setVer] = useState(false);
  const foco = useSharedValue(0);
  const tremer = useSharedValue(0);

  useEffect(() => {
    foco.value = withTiming(focado ? 1 : 0, { duration: 160 });
  }, [focado, foco]);

  useEffect(() => {
    if (erro) {
      tremer.value = withSequence(withTiming(-6, { duration: 50 }), withTiming(6, { duration: 80 }), withTiming(-4, { duration: 70 }), withTiming(0, { duration: 60 }));
    }
  }, [erro, tremer]);

  const animado = useAnimatedStyle(() => ({
    borderColor: erro ? cores.erro : interpolateColor(foco.value, [0, 1], ['rgba(255,255,255,0)', 'rgba(255,255,255,0.55)']),
    transform: [{ translateX: tremer.value }],
  }));

  return (
    <View style={[styles.campo, style]}>
      {!!rotulo && <Text style={styles.rotulo}>{rotulo}</Text>}
      <Animated.View style={[styles.controle, multiline && styles.multi, animado]}>
        <TextInput
          {...props}
          multiline={multiline}
          secureTextEntry={senha && !ver}
          onFocus={(e) => {
            setFocado(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocado(false);
            props.onBlur?.(e);
          }}
          placeholderTextColor={cores.muted}
          selectionColor={cores.destaque}
          accessibilityLabel={rotulo}
          textAlignVertical={multiline ? 'top' : 'center'}
          style={[styles.input, multiline && { minHeight: 100, paddingTop: 16 }]}
        />
        {senha && (
          <Pressable onPress={() => setVer((v) => !v)} hitSlop={10} accessibilityLabel={ver ? 'Ocultar senha' : 'Mostrar senha'}>
            <Ionicons name={ver ? 'eye-off-outline' : 'eye-outline'} size={20} color={cores.muted} />
          </Pressable>
        )}
      </Animated.View>
      {!!erro && <Text style={styles.erro}>{erro}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  campo: { gap: 8 },
  rotulo: { color: cores.texto, fontFamily: fontes.krona, fontSize: 12 },
  controle: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    backgroundColor: cores.controle,
    borderRadius: raios.controle,
    borderWidth: 1,
  },
  multi: { alignItems: 'flex-start' },
  input: { flex: 1, color: cores.texto, fontFamily: fontes.krona, fontSize: 13, paddingVertical: 14 },
  erro: { color: cores.erro, fontSize: 12.5, lineHeight: 17 },
});
