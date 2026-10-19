import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { cores, fontes, LARGURA_MAX } from '../theme';

const ToastContext = createContext({ notificar: () => {} });
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState(null);
  const y = useSharedValue(-160);
  const timer = useRef(null);

  const esconder = useCallback(() => {
    y.value = withTiming(-160, { duration: 260 });
    clearTimeout(timer.current);
  }, [y]);

  const notificar = useCallback(
    (titulo, mensagem, tipo = 'info') => {
      clearTimeout(timer.current);
      setToast({ titulo, mensagem, tipo, id: Date.now() });
      y.value = -160;
      y.value = withSpring(0, { damping: 16, stiffness: 170 });
      timer.current = setTimeout(esconder, 4200);
    },
    [esconder, y]
  );

  useEffect(() => () => clearTimeout(timer.current), []);

  const estilo = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  const icone = toast?.tipo === 'erro' ? 'alert-circle' : toast?.tipo === 'sucesso' ? 'checkmark-circle' : 'notifications';
  const corIcone = toast?.tipo === 'erro' ? cores.erro : toast?.tipo === 'sucesso' ? cores.sucesso : cores.destaque;

  return (
    <ToastContext.Provider value={{ notificar }}>
      {children}
      <Animated.View pointerEvents="box-none" style={[styles.wrap, { top: insets.top + 8 }, estilo]}>
        {toast && (
          <Pressable onPress={esconder} style={styles.toast} accessibilityRole="alert">
            <Ionicons name={icone} size={22} color={corIcone} />
            <View style={styles.textos}>
              <Text style={styles.titulo}>{toast.titulo}</Text>
              {!!toast.mensagem && <Text style={styles.msg}>{toast.mensagem}</Text>}
            </View>
          </Pressable>
        )}
      </Animated.View>
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 16, right: 16, alignItems: 'center', zIndex: 999 },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    maxWidth: LARGURA_MAX,
    padding: 16,
    backgroundColor: cores.abaAtiva,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  textos: { flex: 1, gap: 2 },
  titulo: { color: cores.texto, fontFamily: fontes.krona, fontSize: 12 },
  msg: { color: cores.muted, fontSize: 13 },
});
