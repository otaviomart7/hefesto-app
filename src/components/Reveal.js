import Animated, { FadeInDown } from 'react-native-reanimated';

// Entrada suave e escalonada. Use só na primeira dobra de cada tela.
export default function Reveal({ children, index = 0, style }) {
  return (
    <Animated.View entering={FadeInDown.delay(index * 70).duration(420)} style={style}>
      {children}
    </Animated.View>
  );
}
