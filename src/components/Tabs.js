import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { cores, fontes, raios } from '../theme';

// Abas do Figma: trilho #202229 (raio 12) + aba ativa #3b3d46 (raio 9) com traço de 22×2 embaixo do rótulo
export default function Tabs({ abas, ativa, onChange }) {
  const [largura, setLargura] = useState(0);
  const x = useSharedValue(0);
  const indice = Math.max(0, abas.findIndex((a) => a.id === ativa));
  const itemW = largura ? (largura - 8) / abas.length : 0;

  useEffect(() => {
    x.value = withSpring(indice * itemW, { damping: 20, stiffness: 220 });
  }, [indice, itemW, x]);

  const pilula = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  return (
    <View style={styles.trilho} onLayout={(e) => setLargura(e.nativeEvent.layout.width)} accessibilityRole="tablist">
      {itemW > 0 && <Animated.View style={[styles.pilula, { width: itemW }, pilula]} />}
      {abas.map((a) => {
        const sel = a.id === ativa;
        return (
          <Pressable key={a.id} onPress={() => onChange(a.id)} style={styles.aba} accessibilityRole="tab" accessibilityState={{ selected: sel }}>
            <Text style={[styles.rotulo, { color: sel ? cores.texto : cores.muted }]}>{a.rotulo}</Text>
            <View style={[styles.traco, { opacity: sel ? 1 : 0 }]} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  trilho: { flexDirection: 'row', padding: 4, backgroundColor: cores.card, borderRadius: raios.abas, height: 56 },
  pilula: { position: 'absolute', top: 4, left: 4, height: 48, borderRadius: raios.aba, backgroundColor: cores.abaAtiva },
  aba: { flex: 1, height: 48, alignItems: 'center', justifyContent: 'center', gap: 4 },
  rotulo: { fontFamily: fontes.krona, fontSize: 12 },
  traco: { width: 22, height: 2, borderRadius: 1, backgroundColor: cores.texto },
});
