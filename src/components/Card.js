import { StyleSheet, View } from 'react-native';
import { cores, raios } from '../theme';

export default function Card({ children, style, padding = 20 }) {
  return <View style={[styles.card, { padding }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: { backgroundColor: cores.card, borderRadius: raios.card, gap: 16 },
});
