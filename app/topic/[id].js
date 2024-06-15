import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Alert, TouchableOpacity } from 'react-native';
import { db } from '../../src/config/firebase';
import { doc, getDoc, collection, addDoc, query, orderBy, serverTimestamp, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
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
      if (topicId) { 
        try {
          const topicDoc = await getDoc(doc(db, 'topics', topicId));
          if (topicDoc.exists()) {
            setTopic({ id: topicDoc.id, ...topicDoc.data() });
          } else {
            console.error('Tópico não encontrado');
            Alert.alert('Erro', 'Tópico não encontrado.'); // Exibe alerta para o usuário
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
      fetchComments(); 
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
      const topicSnapshot = await getDoc(topicRef);

      if (topicSnapshot.exists()) {
        const topicData = topicSnapshot.data();
        if (topicData.likes && topicData.likes.includes(user.uid)) {
          // Usuário já curtiu, então remova o like
          await updateDoc(topicRef, {
            likes: arrayRemove(user.uid)
          });
          setTopic(prevTopic => ({
            ...prevTopic,
            likes: prevTopic.likes.filter(id => id !== user.uid)
          }));
        } else {
          // Usuário não curtiu, então adicione o like
          await updateDoc(topicRef, {
            likes: arrayUnion(user.uid)
          });
          setTopic(prevTopic => ({
            ...prevTopic,
            likes: [...(prevTopic?.likes || []), user.uid]
          }));
        }
      }
    } catch (error) {
      console.error('Erro ao curtir/descurtir tópico:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao curtir/descurtir o tópico.');
    }
  };

  return (
    <View style={styles.container}>
      {topic ? (
        <TopicCard
          topic={topic}
          onLikePress={handleLike} 
        />
      ) : (
        <Text>Carregando tópico...</Text> // Exibe mensagem de carregamento
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
