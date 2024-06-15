import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { db } from '../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';

interface TopicCardProps {
  topic: {
    id: string;
    title: string;
    content: string;
    likes: number; 
    comments: number; 
  };
}

const TopicCard: React.FC<TopicCardProps> = ({ topic }) => {
  const handleLike = async () => {
    try {
      const topicRef = doc(db, 'topics', topic.id);
      await updateDoc(topicRef, { likes: topic.likes + 1 });
    } catch (error) {
      console.error('Erro ao curtir tópico:', error);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{topic.title}</Text>
      <Text numberOfLines={2} style={styles.content}>{topic.content}</Text>
      <View style={styles.footer}>
        <TouchableOpacity onPress={handleLike}>
          <Text style={styles.likeButton}>Curtir ({topic.likes})</Text>
        </TouchableOpacity>
        <Text style={styles.comments}>Comentários ({topic.comments})</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  content: {
    fontSize: 14,
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  likeButton: {
    color: '#007bff', // Cor primária do fórum
  },
  comments: {
    color: 'gray',
  },
});

export default TopicCard;
