import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput } from 'react-native';
import { db } from '../../src/config/firebase';
import { doc, getDoc, collection, addDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import TopicCard from '../../src/components/TopicCard';
import Comment from '../../src/components/Comment';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Button from '../../src/components/Button';
import { AuthContext } from '../../src/context/AuthContext';

export default function TopicDetailsScreen() {
  const { id: topicId } = useLocalSearchParams(); // Obtém o ID do tópico da URL
  const [topic, setTopic] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const router = useRouter();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchTopicDetails = async () => {
      try {
        const topicDoc = await getDoc(doc(db, 'topics', topicId));
        if (topicDoc.exists()) {
          setTopic({ id: topicDoc.id, ...topicDoc.data() });
        } else {
          // Lidar com o caso em que o tópico não existe (ex: exibir uma mensagem de erro)
          console.error('Tópico não encontrado');
          router.back(); 
        }
      } catch (error) {
        console.error('Erro ao buscar detalhes do tópico:', error);
      }
    };

    const fetchComments = async () => {
      try {
        const commentsQuery = query(collection(db, 'topics', topicId, 'comments'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(commentsQuery);
        const commentsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setComments(commentsData);
      } catch (error) {
        console.error('Erro ao buscar comentários:', error);
      }
    };

    if (topicId) {
      fetchTopicDetails();
      fetchComments();
    }
  }, [topicId]);

  const handleAddComment = async () => {
    if (!user) {
      Alert.alert('Erro', 'Você precisa estar logado para comentar.');
      return;
    }

    try {
      await addDoc(collection(db, 'topics', topicId, 'comments'), {
        content: newComment,
        createdAt: serverTimestamp(),
        author: user.uid,
        authorName: user.displayName || user.email,
      });
      setNewComment('');
      fetchComments(); // Atualizar a lista de comentários após adicionar um novo
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
      {user && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Adicionar comentário..."
            value={newComment}
            onChangeText={setNewComment}
          />
          <Button title="Enviar" onPress={handleAddComment} />
        </View>
      )}
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
