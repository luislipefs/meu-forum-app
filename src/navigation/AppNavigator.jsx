import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import NewTopicScreen from '../screens/NewTopicScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TopicDetailsScreen from '../screens/TopicDetailsScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Fórum' }} />
      <Stack.Screen name="NewTopic" component={NewTopicScreen} options={{ title: 'Novo Tópico' }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
      <Stack.Screen name="TopicDetails" component={TopicDetailsScreen} options={{ title: 'Detalhes do Tópico' }} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
