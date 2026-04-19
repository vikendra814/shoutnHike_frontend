import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

const initialState = { user: null, token: localStorage.getItem('token'), loading: true };

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, loading: false };
    case 'LOGIN':
      localStorage.setItem('token', action.payload.token);
      return { ...state, user: action.payload.user, token: action.payload.token, loading: false };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return { user: null, token: null, loading: false };
    case 'UPDATE_USAGE':
      return { ...state, user: { ...state.user, ...action.payload } };
    case 'DONE_LOADING':
      return { ...state, loading: false };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (state.token) {
      authAPI.me()
        .then((res) => dispatch({ type: 'SET_USER', payload: res.data.user }))
        .catch(() => dispatch({ type: 'LOGOUT' }));
    } else {
      dispatch({ type: 'DONE_LOADING' });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    dispatch({ type: 'LOGIN', payload: res.data });
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await authAPI.register({ name, email, password });
    dispatch({ type: 'LOGIN', payload: res.data });
    return res.data;
  };

  const logout = () => dispatch({ type: 'LOGOUT' });

  const updateUsage = (usage) => dispatch({ type: 'UPDATE_USAGE', payload: usage });

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateUsage }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
