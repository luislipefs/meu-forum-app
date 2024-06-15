import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CommentProps {
  comment: {
    id: string;
    content: string;
    // ... outros campos do comentário
  };
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
  return (
    <View style={styles.comment}>
      <Text>{comment.content}</Text>
      {/* ... (exibir outros dados do comentário, como autor e data) */}
    </View>
  );
};

const styles = StyleSheet.create({
  comment: {
    backgroundColor: '#f0f0f0', // Cor de fundo do comentário
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
  },
});

export default Comment;
