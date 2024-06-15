import { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Button } from 'react-native';
import { db } from '../../src/config/firebase'
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import TopicCard from '../../src/components/TopicCard';

const HomeScreen = ({ navigation }) => {
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

  const handleTopicPress = (topicId) => {
    navigation.navigate('TopicDetails', { topicId });
  };

  return (
    <View style={styles.container}>
      <Button title="Novo Tópico" onPress={() => navigation.navigate('NewTopic')} />
      <FlatList
        data={topics}
        renderItem={({ item }) => <TopicCard topic={item} onPress={() => handleTopicPress(item.id)} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});

export default HomeScreen;
