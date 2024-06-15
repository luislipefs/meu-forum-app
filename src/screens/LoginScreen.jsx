import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Alert } from 'react-native';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import Button from '../components/Button';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao fazer login. Verifique suas credenciais.');
    }
  };

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // TODO: Adicionar lógica para salvar dados do usuário no Firestore (opcional)
    } catch (error) {
      Alert.alert('Erro', 'Falha ao criar conta. Verifique suas credenciais.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Entrar" onPress={handleLogin} />
      <Button title="Criar Conta" onPress={handleSignUp} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
});

export default LoginScreen;
