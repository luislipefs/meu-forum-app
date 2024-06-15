import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

const TopicCard = ({ topic, onLikePress }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Link href={`/topic/${topic.id}`} asChild>
          <TouchableOpacity>
            <Text style={styles.title}>{topic.title}</Text>
          </TouchableOpacity>
        </Link>
      </View>
      <Text numberOfLines={2} style={styles.content}>
        {topic.content}
      </Text>
      <View style={styles.footer}>
        <View style={styles.authorContainer}>
          <Text style={styles.authorName}>{topic.authorName}</Text>
          <Text style={styles.createdAt}>
            {new Date(topic.createdAt.seconds * 1000).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.statsContainer}>
          <TouchableOpacity onPress={onLikePress}>
            <Text style={styles.likeButton}>Curtir ({topic.likes?.length || 0})</Text>
          </TouchableOpacity>
          <Text style={styles.comments}>Comentários ({topic.comments || 0})</Text>
        </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewDetails: {
    color: '#007bff',
    textDecorationLine: 'underline',
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
  authorContainer: {
    flexDirection: 'column',
  },
  authorName: {
    fontSize: 12,
    color: 'gray',
  },
  createdAt: {
    fontSize: 12,
    color: 'gray',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeButton: {
    color: '#007bff',
    marginRight: 10,
  },
  comments: {
    color: 'gray',
  },
});

export default TopicCard;
