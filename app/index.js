import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Button } from 'react-native';
import { db } from '../../src/config/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import TopicCard from '../../src/components/TopicCard';
import { Link } from 'expo-router';

export default function HomeScreen() {
  const [topics, setTopics] = useState([]);

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

  return (
    <View style={styles.container}>
      <Link href="/new-topic">
        <Button title="Novo Tópico" />
      </Link>
      <FlatList
        data={topics}
        renderItem={({ item }) => (
          <Link href={`/topic/${item.id}`} asChild>
            <TopicCard topic={item} />
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
