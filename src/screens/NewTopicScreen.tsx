import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Alert } from 'react-native';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Button from '../components/Button';
import Input from '../components/Input';

const NewTopicScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleCreateTopic = async () => {
    try {
      await addDoc(collection(db, 'topics'), {
        title,
        content,
        createdAt: serverTimestamp(),
        likes: 0,
        comments: 0,
        // ... (outros dados do tópico, como autor, etc.)
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
