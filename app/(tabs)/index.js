import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Button } from 'react-native';
import { db } from '../../src/config/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Link, useRouter } from 'expo-router';
import TopicCard from '../../src/components/TopicCard';

export default function HomeScreen() {
  const [topics, setTopics] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const q = query(collection(db, 'topics'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const topicsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTopics(topicsData);
      } catch (error) {
        console.error('Erro ao buscar tópicos:', error);
      }
    };

    fetchTopics();
  }, []);

  const handleTopicPress = (topicId) => {
    router.push(`/topic/${topicId}`);
  };

  return (
    <View style={styles.container}>
      <Link href="/new-topic">
        <Button title="Novo Tópico" />
      </Link>
      <FlatList
        data={topics}
        renderItem={({ item }) => (
          <Link href={`/topic/${item.id}`} asChild>
            <TopicCard topic={item} onPress={() => handleTopicPress(item.id)} />
          </Link>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});
