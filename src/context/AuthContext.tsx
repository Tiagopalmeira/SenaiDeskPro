'use client';

import { loginRequest } from '@/api_requests/login';
import { isAdminRole } from '@/constants/adminRoles';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface User {
  username: string;
  nome: string;
  email: string;
  cargo: string;
  matricula: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, forceAdmin: boolean) => Promise<boolean>;
  logout: () => void;
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
    try {
      const response = await loginRequest(username, password);

      if (response.data && response.data.usuario) {
        const { usuario, token } = response.data;

        // Verifica se o cargo do usuário está na lista de administradores
        const hasAdminRole = isAdminRole(usuario.cargo);

        // Se o toggle de admin está marcado mas o usuário não tem cargo de admin, retorna false
        if (forceAdmin && !hasAdminRole) {
          throw new Error('Usuário não possui permissão de administrador');
        }

        const userData = {
          username: usuario.login,
          nome: usuario.nome,
          email: usuario.email,
          cargo: usuario.cargo,
          matricula: usuario.matricula,
          isAdmin: hasAdminRole && forceAdmin, // Só é admin se o cargo permitir E o toggle estiver marcado
        };

        setUser(userData);
        localStorage.setItem('authUser', JSON.stringify(userData));
        localStorage.setItem('authToken', token);

        return true;
      }

      return false;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authUser');
    localStorage.removeItem('authToken');
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
