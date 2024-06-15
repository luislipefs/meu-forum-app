import { Stack, useRouter, useSegments } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../src/context/AuthContext';

export default function Layout() {
  const router = useRouter();
  const { user, isLoading } = useContext(AuthContext);
  const segments = useSegments();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isLoading || !isReady) return; // Aguarda o carregamento e a montagem do componente

    // Verifica a autenticação apenas na rota inicial (tabs)
    if (segments.length === 1 && segments[0] === '(tabs)' && !user) {
      router.replace('/login');
    }
  }, [user, isLoading, isReady, segments]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
