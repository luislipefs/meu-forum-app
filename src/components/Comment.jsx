import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Comment = ({ comment }) => {
  const formattedDate = new Date(comment.createdAt.seconds * 1000).toLocaleDateString(); // Formata a data

  return (
    <View style={styles.commentContainer}>
      <View style={styles.header}>
        <Text style={styles.authorName}>{comment.authorName}</Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>
      <Text style={styles.content}>{comment.content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  commentContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  authorName: {
    fontWeight: 'bold',
  },
  date: {
    fontSize: 12,
    color: 'gray',
  },
  content: {
    fontSize: 14,
  },
});

export default Comment;
