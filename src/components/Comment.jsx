import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Comment = ({ comment }) => {
  return (
    <View style={styles.comment}>
      <Text>{comment.content}</Text>
      {/* ... (exibir outros dados do comentário, como autor e data) */}
    </View>
  );
};

const styles = StyleSheet.create({
  comment: {
    backgroundColor: '#f0f0f0', 
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
  },
});

export default Comment;
