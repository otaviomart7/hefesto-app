import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { cores, LARGURA_MAX } from '../theme';
import AppHeader from './AppHeader';

// Estrutura comum: fundo, cabeçalho e conteúdo centralizado (362 px de conteúdo no Figma)
export default function Screen({ children, voltar, carrinho, scroll = true, semHeader = false, contentStyle, refScroll, abaInferior = true }) {
  const conteudo = (
    <View style={[styles.conteudo, contentStyle]}>{children}</View>
  );
  return (
    <View style={styles.raiz}>
      <StatusBar style="light" />
      {!semHeader && <AppHeader voltar={voltar} carrinho={carrinho} />}
      {scroll ? (
        <KeyboardAvoidingView behavior="padding" style={styles.scroll}>
        <ScrollView
          ref={refScroll}
          style={styles.scroll}
          contentContainerStyle={[styles.scrollConteudo, { paddingBottom: abaInferior ? 32 : 48 }]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          {conteudo}
        </ScrollView>
        </KeyboardAvoidingView>
      ) : (
        conteudo
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: cores.fundo },
  scroll: { flex: 1 },
  scrollConteudo: { flexGrow: 1, paddingTop: 24 },
  conteudo: { width: '100%', maxWidth: LARGURA_MAX, alignSelf: 'center', paddingHorizontal: 20, gap: 20 },
});
