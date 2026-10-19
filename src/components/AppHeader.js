import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { cores, fontes, LARGURA_MAX, useLayout } from '../theme';
import { useAuth } from '../store/AuthContext';
import { useCarrinho } from '../store/CartContext';

// Cabeçalho do Figma: marca à esquerda, "Perfil" + avatar à direita (80 px de altura)
export default function AppHeader({ voltar = false, carrinho = true }) {
  const insets = useSafeAreaInsets();
  const nav = useNavigation();
  const { esc } = useLayout();
  const { usuario } = useAuth();
  const { quantidade } = useCarrinho();

  const irPerfil = () => {
    if (usuario) nav.navigate('Main', { screen: 'Conta' });
    else nav.navigate('Auth', { retorno: 'Conta' });
  };

  return (
    <View style={[styles.fundo, { paddingTop: insets.top }]}>
      <View style={styles.linha}>
        <View style={styles.esquerda}>
          {voltar && (
            <Pressable onPress={() => nav.goBack()} hitSlop={12} style={styles.voltar} accessibilityLabel="Voltar" accessibilityRole="button">
              <Ionicons name="chevron-back" size={22} color={cores.texto} />
            </Pressable>
          )}
          <Pressable onPress={() => nav.navigate('Main', { screen: 'Início' })} accessibilityRole="link" accessibilityLabel="Hefesto, ir para o início">
            <Text style={[styles.marca, { fontSize: esc(23) }]}>Hefesto</Text>
          </Pressable>
        </View>

        <View style={styles.direita}>
          {carrinho && (
            <Pressable onPress={() => nav.navigate('Carrinho')} hitSlop={10} style={styles.carrinho} accessibilityLabel={`Carrinho, ${quantidade} itens`} accessibilityRole="button">
              <Ionicons name="cart-outline" size={24} color={cores.texto} />
              {quantidade > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeTxt}>{quantidade > 99 ? '99+' : quantidade}</Text>
                </View>
              )}
            </Pressable>
          )}
          <Pressable onPress={irPerfil} style={styles.perfil} accessibilityRole="button" accessibilityLabel="Perfil">
            <Text style={styles.perfilTxt}>Perfil</Text>
            <View style={styles.avatar}>
              <Ionicons name="person" size={18} color={cores.texto} />
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fundo: { backgroundColor: cores.cabecalho, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  linha: {
    height: 80,
    width: '100%',
    maxWidth: LARGURA_MAX + 40,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  esquerda: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  voltar: { width: 34, height: 34, borderRadius: 17, backgroundColor: cores.controle, alignItems: 'center', justifyContent: 'center' },
  marca: { color: cores.texto, fontFamily: fontes.krona },
  direita: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  carrinho: { padding: 4 },
  badge: {
    position: 'absolute',
    top: -2,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: cores.destaque,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeTxt: { color: cores.fundo, fontFamily: fontes.krona, fontSize: 9 },
  perfil: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 44 },
  perfilTxt: { color: cores.texto, fontFamily: fontes.krona, fontSize: 12 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: cores.controle, alignItems: 'center', justifyContent: 'center' },
});
