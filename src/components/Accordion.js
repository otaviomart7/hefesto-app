import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { cores, fontes, raios } from '../theme';

export function AccordionItem({ pergunta, resposta }) {
  const [aberto, setAberto] = useState(false);
  const giro = useSharedValue(0);
  const seta = useAnimatedStyle(() => ({ transform: [{ rotate: `${giro.value * 180}deg` }] }));

  const alternar = () => {
    giro.value = withTiming(aberto ? 0 : 1, { duration: 220 });
    setAberto((a) => !a);
  };

  return (
    <Animated.View layout={LinearTransition.duration(220)} style={styles.item}>
      <Pressable onPress={alternar} style={styles.cabeca} accessibilityRole="button" accessibilityState={{ expanded: aberto }}>
        <Text style={styles.pergunta}>{pergunta}</Text>
        <Animated.View style={seta}>
          <Ionicons name="chevron-down" size={18} color={cores.texto} />
        </Animated.View>
      </Pressable>
      {aberto && (
        <Animated.View entering={FadeIn.duration(220)} exiting={FadeOut.duration(120)}>
          <Text style={styles.resposta}>{resposta}</Text>
        </Animated.View>
      )}
    </Animated.View>
  );
}

export default function Accordion({ itens }) {
  return (
    <View style={{ gap: 10 }}>
      {itens.map((i) => (
        <AccordionItem key={i.pergunta} {...i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  item: { backgroundColor: cores.controle, borderRadius: raios.controle, overflow: 'hidden' },
  cabeca: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  pergunta: { flex: 1, color: cores.texto, fontFamily: fontes.krona, fontSize: 12, lineHeight: 19 },
  resposta: { color: cores.textoSuave, fontSize: 14, lineHeight: 21, paddingHorizontal: 16, paddingBottom: 16 },
});
