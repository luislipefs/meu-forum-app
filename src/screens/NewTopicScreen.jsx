import React, { useState, useContext } from 'react';
import { View, TextInput, StyleSheet, Alert } from 'react-native';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Button from '../components/Button';
import Input from '../components/Input';
import { AuthContext } from '../context/AuthContext';

const NewTopicScreen = ({ navigation }) => {
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
        author: user.uid, // ID do usuário que criou o tópico
        authorName: user.displayName || user.email, // Nome de exibição ou email do usuário
      });
      navigation.goBack();
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

export default NewTopicScreen;
