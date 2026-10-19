import { StyleSheet, Text, View } from 'react-native';
import { cores, fontes, useLayout } from '../theme';

// Bloco "Apresentação" do Figma: título 30 px + descrição 14 px
export default function Titulo({ titulo, descricao, style, tamanho = 30 }) {
  const { esc } = useLayout();
  return (
    <View style={[{ gap: 4 }, style]}>
      <Text accessibilityRole="header" style={[styles.titulo, { fontSize: esc(tamanho), lineHeight: esc(tamanho * 1.35) }]}>
        {titulo}
      </Text>
      {!!descricao && <Text style={styles.desc}>{descricao}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  titulo: { color: cores.texto, fontFamily: fontes.krona },
  desc: { color: cores.muted, fontFamily: fontes.krona, fontSize: 14, lineHeight: 22 },
});
