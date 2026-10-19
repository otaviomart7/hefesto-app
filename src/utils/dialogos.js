import { Alert, Platform } from 'react-native';

// Alert.alert com botões não funciona no web; usa window.confirm como alternativa.
export function avisar(titulo, mensagem) {
  if (Platform.OS === 'web') window.alert(`${titulo}\n\n${mensagem}`);
  else Alert.alert(titulo, mensagem);
}

export function confirmar({ titulo, mensagem, confirmarTxt = 'Confirmar', cancelarTxt = 'Voltar', destrutivo = false, onConfirm }) {
  if (Platform.OS === 'web') {
    if (window.confirm(`${titulo}\n\n${mensagem}`)) onConfirm();
    return;
  }
  Alert.alert(titulo, mensagem, [
    { text: cancelarTxt, style: 'cancel' },
    { text: confirmarTxt, style: destrutivo ? 'destructive' : 'default', onPress: onConfirm },
  ]);
}
