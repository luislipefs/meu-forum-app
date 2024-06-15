import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const Input = ({ placeholder, value, onChangeText, secureTextEntry = false, multiline = false, style }) => {
  return (
    <TextInput
      style={[styles.input, style]} // Combina os estilos padrão com os estilos personalizados
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      multiline={multiline}
      autoCapitalize="none" // Desativa a autocapitalização
      placeholderTextColor="#888" // Cor do placeholder
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: '#ccc', // Cor da borda
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5, // Borda arredondada
  },
});

export default Input;
