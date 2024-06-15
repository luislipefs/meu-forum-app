import React, { useState, useContext } from 'react';
import { View, TextInput, StyleSheet, Alert } from 'react-native';
import { db } from '../../src/config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Button from '../../src/components/Button';
import Input from '../../src/components/Input';
import { AuthContext } from '../../src/context/AuthContext';

export default function NewTopicScreen() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { user } = useContext(AuthContext);

  const handleCreateTopic = async () => {
    if (!user) {
      Alert.alert('Erro', 'Você precisa estar logado para criar um tópico.');
      return;
    }

    try {
      await addDoc(collection(db, 'topics'), {
        title,
        content,
        createdAt: serverTimestamp(),
        likes: 0,
        comments: 0,
        author: user?.uid,
        authorName: user?.displayName || user?.email,
      });
      // Redireciona para a página inicial após criar o tópico
      redirect('/');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao criar tópico.');
    }
  };

  return (
    <View style={styles.container}>
      <Input
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
      />
      <Input
        placeholder="Conteúdo"
        value={content}
        onChangeText={setContent}
        multiline
        numberOfLines={4}
      />
      <Button title="Criar Tópico" onPress={handleCreateTopic} />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    input: {
      marginBottom: 10,
    },
  });