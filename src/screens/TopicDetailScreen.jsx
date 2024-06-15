import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Button } from 'react-native';
import { db } from '../config/firebase';
import { doc, getDoc, collection, addDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import TopicCard from '../components/TopicCard';
import Comment from '../components/Comment';

const TopicDetailsScreen = ({ route, navigation }) => {
  const { topicId } = route.params;
  const [topic, setTopic] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchTopic = async () => {
      const docRef = doc(db, 'topics', topicId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setTopic(docSnap.data());
      } else {
        // Lidar com o caso em que o tópico não existe
      }
    };

    const fetchComments = async () => {
      const q = query(collection(db, 'topics', topicId, 'comments'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const commentsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComments(commentsData);
    };

    fetchTopic();
    fetchComments();
  }, [topicId]);

  const handleAddComment = async () => {
    try {
      await addDoc(collection(db, 'topics', topicId, 'comments'), {
        content: newComment,
        createdAt: serverTimestamp(),
        // ... (outros dados do comentário, como autor, etc.)
      });
      setNewComment(''); // Limpar o campo de entrada após adicionar o comentário
      // Atualizar a lista de comentários
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
    }
  };

  return (
    <View style={styles.container}>
      {topic && <TopicCard topic={topic} />}
      <FlatList
        data={comments}
        renderItem={({ item }) => <Comment comment={item} />}
        keyExtractor={(item) => item.id}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Adicionar comentário..."
          value={newComment}
          onChangeText={setNewComment}
        />
        <Button title="Enviar" onPress={handleAddComment} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 10,
    padding: 10,
  },
});

export default TopicDetailsScreen;
