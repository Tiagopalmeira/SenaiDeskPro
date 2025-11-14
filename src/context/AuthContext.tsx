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
  id_usuario?: number; // ID do usuário retornado pela API
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
    // Login mockado - aceita USR/PSSW (para desenvolvimento)
    if (username === 'USR' && password === 'PSSW') {
      const userData = {
        username: 'USR',
        nome: 'Usuário Teste',
        email: 'usuario@teste.com',
        cargo: 'TI',
        matricula: '123456',
        isAdmin: forceAdmin, // Respeita o toggle
        id_usuario: 1, // ID mockado para desenvolvimento
      };

      setUser(userData);
      localStorage.setItem('authUser', JSON.stringify(userData));
      localStorage.setItem('authToken', 'mock-token-123');

      return true;
    }

    // Login real com a API
    try {
      const { loginRequest } = await import('@/api_requests/login');
      const response = await loginRequest(username, password);
      const usuario = response.data.usuario;
      
      // Determina se é admin baseado no cargo ou no toggle
      // Ajuste esta lógica conforme sua regra de negócio
      const isAdminUser = forceAdmin || 
        usuario.cargo?.toLowerCase().includes('admin') || 
        usuario.cargo?.toLowerCase().includes('administrador');
      
      const userData = {
        username: usuario.login,
        nome: usuario.nome,
        email: usuario.email,
        cargo: usuario.cargo,
        matricula: usuario.matricula || '',
        isAdmin: isAdminUser,
        id_usuario: usuario.id_usuario,
      };

      setUser(userData);
      localStorage.setItem('authUser', JSON.stringify(userData));
      localStorage.setItem('authToken', response.data.token);

      return true;
    } catch (error: any) {
      console.error('Erro no login:', error);
      // Se a API não estiver disponível, retorna false
      // Isso permite que o login mockado ainda funcione em desenvolvimento
      if (error.message?.includes('fetch') || error.message?.includes('Network')) {
        // Erro de rede - API não disponível
        throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão.');
      }
      throw error;
    }
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
