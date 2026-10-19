import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cores, fontes } from '../theme';
import Button from './Button';

export default function EmptyState({ icone = 'cube-outline', titulo, texto, acao, onAcao }) {
  return (
    <View style={styles.box}>
      <View style={styles.circulo}>
        <Ionicons name={icone} size={28} color={cores.muted} />
      </View>
      <Text style={styles.titulo}>{titulo}</Text>
      {!!texto && <Text style={styles.texto}>{texto}</Text>}
      {!!acao && <Button titulo={acao} onPress={onAcao} variante="secundario" style={{ alignSelf: 'stretch', marginTop: 8 }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', gap: 10, paddingVertical: 28, paddingHorizontal: 12 },
  circulo: { width: 64, height: 64, borderRadius: 32, backgroundColor: cores.controle, alignItems: 'center', justifyContent: 'center' },
  titulo: { color: cores.texto, fontFamily: fontes.krona, fontSize: 14, textAlign: 'center' },
  texto: { color: cores.muted, fontSize: 14, lineHeight: 21, textAlign: 'center' },
});
