import { Stack, useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../src/context/AuthContext';

export default function Layout() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [isMounted, setIsMounted] = useState(false); // Novo estado

  useEffect(() => {
    setIsMounted(true); // Atualiza o estado quando o componente é montado

    // Só redireciona se o componente estiver montado e o usuário não estiver logado
    if (isMounted && !user) { 
      router.replace('/login');
    }
  }, [user, isMounted]); // Adiciona isMounted às dependências

  return <Stack screenOptions={{ headerShown: false }} />;
}
