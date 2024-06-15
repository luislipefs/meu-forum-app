import React, { createContext, useReducer, useEffect } from 'react';
import { auth } from '../config/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';

export const AuthContext = createContext({
  user: null,
  isLoading: true, 
  login: (user) => {},
  logout: () => {},
});

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload, isLoading: false };
    case 'LOGOUT':
      return { ...state, user: null, isLoading: false };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user: null, isLoading: true });
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch({ type: 'LOGIN', payload: user });
        router.replace('/(tabs)/index');
      } else {
        dispatch({ type: 'LOGOUT' });
        router.replace('/login');
      }
    });

    return unsubscribe;
  }, []);

  const login = (user) => {
    dispatch({ type: 'LOGIN', payload: user });
  };

  const logout = async () => {
    try {
      await signOut(auth);
      dispatch({ type: 'LOGOUT' });
      router.push('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
