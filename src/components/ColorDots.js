import { StyleSheet, View } from 'react-native';

export default function ColorDots({ cores: lista, max = 8, tamanho = 16 }) {
  const visiveis = lista.slice(0, max);
  return (
    <View style={styles.linha}>
      {visiveis.map((c) => (
        <View key={c.nome} style={[styles.dot, { width: tamanho, height: tamanho, borderRadius: tamanho / 2, backgroundColor: c.hex }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  linha: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  dot: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
});
