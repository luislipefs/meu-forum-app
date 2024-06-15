import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      navigation.navigate('Home'); 
    } catch (error) {
      Alert.alert('Erro', 'Falha ao fazer login. Verifique suas credenciais.');
    }
  };

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Opcional: Adicionar lógica para salvar dados do usuário no Firestore
    } catch (error) {
      Alert.alert('Erro', 'Falha ao criar conta. Verifique suas credenciais.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Inputs de email e senha */}
      <Button title="Entrar" onPress={handleLogin} />
      <Button title="Criar Conta" onPress={handleSignUp} />
    </View>
  );
};

const styles = StyleSheet.create({
  // ... seus estilos aqui
});

export default LoginScreen;
