import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { auth } from '../config/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return unsubscribe; // Limpar o listener ao desmontar o componente
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login'); // Navega para a tela de login após o logout
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text>Bem-vindo, {user.email}!</Text>
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
});

export default ProfileScreen;
