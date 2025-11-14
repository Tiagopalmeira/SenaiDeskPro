'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface User {
  username: string;
  nome: string;
  email: string;
  cargo: string;
  matricula: string;
  isAdmin: boolean;
  photoUrl?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, forceAdmin: boolean) => Promise<boolean>;
  logout: () => void;
  updateUserPhoto: (photoUrl: string) => void;
  updateUserName: (nome: string) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restaurar sessão do localStorage ao montar o componente
  useEffect(() => {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('authUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string, forceAdmin: boolean = false): Promise<boolean> => {
    // Login mockado - aceita USR/PSSW
    if (username === 'USR' && password === 'PSSW') {
      const userData = {
        username: 'USR',
        nome: 'Usuário Teste',
        email: 'usuario@teste.com',
        cargo: 'TI',
        matricula: '123456',
        isAdmin: forceAdmin, // Respeita o toggle
      };

      setUser(userData);
      localStorage.setItem('authUser', JSON.stringify(userData));
      localStorage.setItem('authToken', 'mock-token-123');

      return true;
    }

    // Qualquer outra credencial retorna erro
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authUser');
    localStorage.removeItem('authToken');
  };

  const updateUserPhoto = (photoUrl: string) => {
    if (user) {
      const updatedUser = { ...user, photoUrl };
      setUser(updatedUser);
      localStorage.setItem('authUser', JSON.stringify(updatedUser));
    }
  };

  const updateUserName = (nome: string) => {
    if (user) {
      const updatedUser = { ...user, nome };
      setUser(updatedUser);
      localStorage.setItem('authUser', JSON.stringify(updatedUser));
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateUserPhoto,
        updateUserName,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
