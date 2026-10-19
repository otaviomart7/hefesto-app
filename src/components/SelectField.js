import { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { cores, fontes, LARGURA_MAX, raios } from '../theme';

// Seletor em "bottom sheet". opcoes: [{ valor, rotulo, hex?, sub? }]
export default function SelectField({ rotulo, valor, opcoes, onChange, buscavel = false, erro, placeholder = 'Selecione' }) {
  const [aberto, setAberto] = useState(false);
  const [busca, setBusca] = useState('');
  const insets = useSafeAreaInsets();
  const atual = opcoes.find((o) => o.valor === valor);

  const filtradas = useMemo(
    () => (busca ? opcoes.filter((o) => o.rotulo.toLowerCase().includes(busca.toLowerCase())) : opcoes),
    [busca, opcoes]
  );

  const fechar = () => {
    setAberto(false);
    setBusca('');
  };

  return (
    <View style={{ gap: 8 }}>
      {!!rotulo && <Text style={styles.rotulo}>{rotulo}</Text>}
      <Pressable
        onPress={() => setAberto(true)}
        style={[styles.controle, erro && { borderColor: cores.erro }]}
        accessibilityRole="button"
        accessibilityLabel={`${rotulo}: ${atual?.rotulo ?? placeholder}`}
      >
        {atual?.hex && <View style={[styles.dot, { backgroundColor: atual.hex }]} />}
        <Text numberOfLines={1} style={[styles.valor, !atual && { color: cores.muted }]}>
          {atual?.rotulo ?? placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color={cores.muted} />
      </Pressable>
      {!!erro && <Text style={styles.erro}>{erro}</Text>}

      <Modal visible={aberto} transparent animationType="slide" onRequestClose={fechar} statusBarTranslucent>
        <Pressable style={styles.fundo} onPress={fechar} accessibilityLabel="Fechar" />
        <View style={[styles.folha, { paddingBottom: insets.bottom + 12 }]}>
          <View style={styles.alca} />
          <Text style={styles.folhaTitulo}>{rotulo}</Text>
          {buscavel && (
            <View style={styles.busca}>
              <Ionicons name="search" size={18} color={cores.muted} />
              <TextInput
                value={busca}
                onChangeText={setBusca}
                placeholder="Buscar"
                placeholderTextColor={cores.muted}
                style={styles.buscaInput}
                autoCorrect={false}
              />
            </View>
          )}
          <FlatList
            data={filtradas}
            keyExtractor={(o) => String(o.valor)}
            keyboardShouldPersistTaps="handled"
            style={{ maxHeight: 380 }}
            ListEmptyComponent={<Text style={styles.vazio}>Nada encontrado.</Text>}
            renderItem={({ item }) => {
              const ativo = item.valor === valor;
              return (
                <Pressable
                  onPress={() => {
                    onChange(item.valor);
                    fechar();
                  }}
                  style={[styles.opcao, ativo && { backgroundColor: cores.abaAtiva }]}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: ativo }}
                >
                  {item.hex && <View style={[styles.dot, { backgroundColor: item.hex }]} />}
                  <View style={{ flex: 1 }}>
                    <Text style={styles.opcaoTxt}>{item.rotulo}</Text>
                    {!!item.sub && <Text style={styles.opcaoSub}>{item.sub}</Text>}
                  </View>
                  {ativo && <Ionicons name="checkmark" size={18} color={cores.texto} />}
                </Pressable>
              );
            }}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  rotulo: { color: cores.texto, fontFamily: fontes.krona, fontSize: 12 },
  controle: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    backgroundColor: cores.controle,
    borderRadius: raios.controle,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  valor: { flex: 1, color: cores.texto, fontFamily: fontes.krona, fontSize: 13 },
  dot: { width: 18, height: 18, borderRadius: 9, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  erro: { color: cores.erro, fontSize: 12.5 },
  fundo: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  folha: {
    width: '100%',
    maxWidth: LARGURA_MAX,
    alignSelf: 'center',
    backgroundColor: cores.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 10,
    gap: 12,
  },
  alca: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.25)' },
  folhaTitulo: { color: cores.texto, fontFamily: fontes.krona, fontSize: 16, paddingHorizontal: 4 },
  busca: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, height: 46, borderRadius: raios.controle, backgroundColor: cores.controle },
  buscaInput: { flex: 1, color: cores.texto, fontFamily: fontes.krona, fontSize: 13 },
  opcao: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 14, borderRadius: raios.controle },
  opcaoTxt: { color: cores.texto, fontFamily: fontes.krona, fontSize: 13 },
  opcaoSub: { color: cores.muted, fontSize: 12.5, marginTop: 2 },
  vazio: { color: cores.muted, textAlign: 'center', padding: 24 },
});
