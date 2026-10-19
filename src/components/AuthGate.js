import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { cores, fontes } from '../theme';
import Button from './Button';
import Card from './Card';

// RN001 / RN008 — recurso restrito: pede login ou cadastro antes de continuar
export default function AuthGate({ retorno, titulo = 'Entre para continuar', texto }) {
  const nav = useNavigation();
  return (
    <Card style={{ alignItems: 'center', gap: 14, paddingVertical: 28 }}>
      <View style={styles.circulo}>
        <Ionicons name="lock-closed" size={24} color={cores.texto} />
      </View>
      <Text style={styles.titulo}>{titulo}</Text>
      <Text style={styles.texto}>{texto}</Text>
      <View style={{ alignSelf: 'stretch', gap: 10, marginTop: 6 }}>
        <Button titulo="Entrar" onPress={() => nav.navigate('Auth', { retorno, aba: 'entrar' })} />
        <Button titulo="Criar conta" variante="secundario" onPress={() => nav.navigate('Auth', { retorno, aba: 'cadastrar' })} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  circulo: { width: 56, height: 56, borderRadius: 28, backgroundColor: cores.controle, alignItems: 'center', justifyContent: 'center' },
  titulo: { color: cores.texto, fontFamily: fontes.krona, fontSize: 16, textAlign: 'center' },
  texto: { color: cores.muted, fontSize: 14, lineHeight: 21, textAlign: 'center' },
});
