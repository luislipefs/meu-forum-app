import React, { useContext } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { AuthContext } from '../../src/context/AuthContext';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text style={styles.email}>Bem-vindo, {user.email}!</Text>
          <Button title="Logout" onPress={handleLogout} />
        </>
      ) : (
        <Text>Você não está logado.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  email: {
    fontSize: 18,
    marginBottom: 10,
  },
});
