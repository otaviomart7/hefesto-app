import { StyleSheet, Text, View } from 'react-native';
import { cores, fontes } from '../theme';
import { COR_STATUS } from '../utils/status';

export default function StatusPill({ status }) {
  return (
    <View style={styles.pill} accessibilityLabel={`Status: ${status}`}>
      <View style={[styles.dot, { backgroundColor: COR_STATUS[status] ?? cores.muted }]} />
      <Text style={styles.txt}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, backgroundColor: cores.controle, borderRadius: 999 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  txt: { color: cores.texto, fontFamily: fontes.krona, fontSize: 11 },
});
