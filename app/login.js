import React, { useState, useContext } from 'react';
import { View, TextInput, StyleSheet, Alert } from 'react-native';
import { auth } from '../../src/config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import Button from '../../src/components/Button';
import { AuthContext } from '../../src/context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { dispatch } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      dispatch({ type: 'LOGIN', payload: user }); 
      // Redireciona para a página inicial após o login bem-sucedido
      // Como você está usando o Expo Router, você pode usar a função `redirect` para redirecionar o usuário:
      redirect('/');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao fazer login. Verifique suas credenciais.');
    }
  };

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Salvar dados do usuário no Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        // ... outros dados do usuário (nome, foto, etc.)
      });

      dispatch({ type: 'LOGIN', payload: user }); 
      redirect('/');
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
