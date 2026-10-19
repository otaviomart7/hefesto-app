import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cores, fontes } from '../theme';

export default function Stepper({ valor, onChange, min = 1, max = 999 }) {
  return (
    <View style={styles.linha}>
      <Pressable
        onPress={() => onChange(Math.max(min, valor - 1))}
        disabled={valor <= min}
        hitSlop={8}
        style={[styles.botao, valor <= min && { opacity: 0.4 }]}
        accessibilityRole="button"
        accessibilityLabel="Diminuir quantidade"
      >
        <Ionicons name="remove" size={18} color={cores.texto} />
      </Pressable>
      <Text style={styles.valor} accessibilityLabel={`Quantidade ${valor}`}>
        {valor}
      </Text>
      <Pressable
        onPress={() => onChange(Math.min(max, valor + 1))}
        hitSlop={8}
        style={styles.botao}
        accessibilityRole="button"
        accessibilityLabel="Aumentar quantidade"
      >
        <Ionicons name="add" size={18} color={cores.texto} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  botao: { width: 36, height: 36, borderRadius: 18, backgroundColor: cores.controle, alignItems: 'center', justifyContent: 'center' },
  valor: { minWidth: 24, textAlign: 'center', color: cores.texto, fontFamily: fontes.krona, fontSize: 14 },
});
