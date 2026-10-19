import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cores, fontes } from '../theme';
import { useOrders } from '../store/OrdersContext';

import SplashScreen from '../screens/SplashScreen';
import AuthScreen from '../screens/AuthScreen';
import HomeScreen from '../screens/HomeScreen';
import MateriaisScreen from '../screens/MateriaisScreen';
import DetalhesScreen from '../screens/DetalhesScreen';
import CarrinhoScreen from '../screens/CarrinhoScreen';
import OrcamentoScreen from '../screens/OrcamentoScreen';
import ConfirmacaoScreen from '../screens/ConfirmacaoScreen';
import ContaScreen from '../screens/ContaScreen';
import PedidoScreen from '../screens/PedidoScreen';
import ContatoScreen from '../screens/ContatoScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const tema = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: cores.fundo, card: cores.cabecalho, text: cores.texto, border: 'rgba(255,255,255,0.06)', primary: cores.texto },
};

const ICONES = {
  Início: ['home', 'home-outline'],
  Materiais: ['cube', 'cube-outline'],
  Orçamento: ['document-text', 'document-text-outline'],
  Conta: ['receipt', 'receipt-outline'],
  Contato: ['chatbubbles', 'chatbubbles-outline'],
};

function Abas() {
  const insets = useSafeAreaInsets();
  const { pedidos } = useOrders();
  const aguardando = pedidos.filter((p) => p.status === 'Orçamento enviado').length;

  return (
    <Tab.Navigator
      initialRouteName="Início"
      screenOptions={({ route }) => ({
        headerShown: false,
        animation: 'fade',
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: cores.texto,
        tabBarInactiveTintColor: cores.muted,
        tabBarLabelStyle: { fontFamily: fontes.krona, fontSize: 9, marginTop: 2 },
        tabBarStyle: {
          backgroundColor: cores.cabecalho,
          borderTopColor: 'rgba(255,255,255,0.06)',
          height: 62 + insets.bottom,
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 8),
        },
        tabBarIcon: ({ focused, color }) => <Ionicons name={ICONES[route.name][focused ? 0 : 1]} size={22} color={color} />,
        tabBarBadgeStyle: { backgroundColor: cores.aviso, color: cores.fundo, fontFamily: fontes.krona, fontSize: 9 },
      })}
    >
      <Tab.Screen name="Início" component={HomeScreen} />
      <Tab.Screen name="Materiais" component={MateriaisScreen} />
      <Tab.Screen name="Orçamento" component={OrcamentoScreen} />
      <Tab.Screen name="Conta" component={ContaScreen} options={{ tabBarLabel: 'Pedidos', tabBarBadge: aguardando > 0 ? aguardando : undefined }} />
      <Tab.Screen name="Contato" component={ContatoScreen} />
    </Tab.Navigator>
  );
}

export default function Navegacao() {
  return (
    <NavigationContainer theme={tema}>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false, contentStyle: { backgroundColor: cores.fundo }, animation: 'slide_from_right' }}>
        <Stack.Screen name="Splash" component={SplashScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Auth" component={AuthScreen} options={{ animation: 'fade_from_bottom' }} />
        <Stack.Screen name="Main" component={Abas} options={{ animation: 'fade' }} />
        <Stack.Screen name="Detalhes" component={DetalhesScreen} />
        <Stack.Screen name="Carrinho" component={CarrinhoScreen} options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="Confirmacao" component={ConfirmacaoScreen} options={{ animation: 'fade_from_bottom', gestureEnabled: false }} />
        <Stack.Screen name="Pedido" component={PedidoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
