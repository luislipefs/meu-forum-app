import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Alert } from 'react-native';
import { db } from '../../src/config/firebase'
import { doc, getDoc, collection, addDoc, query, orderBy, serverTimestamp, updateDoc, arrayUnion } from 'firebase/firestore';
import TopicCard from '../../src/components/TopicCard';
import Comment from '../../src/components/Comment';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Button from '../../src/components/Button';
import { AuthContext } from '../../src/context/AuthContext';

export default function TopicDetailsScreen() {
  const { id: topicId } = useLocalSearchParams();
  const [topic, setTopic] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const router = useRouter();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchTopicDetails = async () => {
      if (topicId) { // Verifica se o topicId está definido
        try {
          const topicDoc = await getDoc(doc(db, 'topics', topicId));
          if (topicDoc.exists()) {
            setTopic({ id: topicDoc.id, ...topicDoc.data() });
          } else {
            console.error('Tópico não encontrado');
            router.back();
          }
        } catch (error) {
          console.error('Erro ao buscar detalhes do tópico:', error);
          Alert.alert('Erro', 'Ocorreu um erro ao carregar o tópico.');
        }
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
        Alert.alert('Erro', 'Ocorreu um erro ao carregar os comentários.');
      }
    };

    fetchTopicDetails();
    fetchComments();
  }, [topicId]); // Executa o useEffect apenas quando topicId mudar

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
      fetchComments(); // Atualiza a lista de comentários após adicionar um novo
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao adicionar o comentário.');
    }
  };

  const handleLike = async () => {
    if (!user) {
      Alert.alert('Erro', 'Você precisa estar logado para curtir.');
      return;
    }

    try {
      const topicRef = doc(db, 'topics', topicId);
      await updateDoc(topicRef, { 
        likes: arrayUnion(user.uid) // Adiciona o ID do usuário à lista de likes
      });

      // Atualiza o estado local do tópico para refletir a curtida
      setTopic(prevTopic => ({
        ...prevTopic,
        likes: [...(prevTopic?.likes || []), user.uid] 
      }));
    } catch (error) {
      console.error('Erro ao curtir tópico:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao curtir o tópico.');
    }
  };

  return (
    <View style={styles.container}>
      {topic && (
        <TopicCard 
          topic={topic} 
          onLikePress={handleLike} // Passa a função handleLike para o TopicCard
        />
      )}
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
