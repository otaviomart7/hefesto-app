import { useEffect } from 'react';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, KronaOne_400Regular } from '@expo-google-fonts/krona-one';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { cores } from './src/theme';
import { ToastProvider } from './src/store/ToastContext';
import { AuthProvider } from './src/store/AuthContext';
import { CartProvider } from './src/store/CartContext';
import { OrdersProvider } from './src/store/OrdersContext';
import Navegacao from './src/navigation';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [fontesProntas] = useFonts({ KronaOne_400Regular });

  useEffect(() => {
    if (fontesProntas) SplashScreen.hideAsync().catch(() => {});
  }, [fontesProntas]);

  if (!fontesProntas) return <View style={{ flex: 1, backgroundColor: cores.fundo }} />;

  return (
    <SafeAreaProvider>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <OrdersProvider>
              <Navegacao />
            </OrdersProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </SafeAreaProvider>
  );
}
