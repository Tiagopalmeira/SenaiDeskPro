'use client';

import { Button } from '@/components/Button';
import { Input, Label } from '@/components/Input';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
`;

const LoginCard = styled.div`
  background: white;
  padding: 48px 40px;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  width: 100%;
  max-width: 420px;
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
`;

const LogoPlaceholder = styled.div`
  width: 120px;
  height: 40px;
  background: #e5e7eb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #6b7280;
  font-weight: 600;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  background: #fee2e2;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
  text-align: center;
`;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(usuario, senha, false);

      if (success) {
        router.push('/home');
      } else {
        setError('Credenciais inválidas. Verifique seu usuário e senha.');
      }
    } catch (err: any) {
      if (err.message?.includes('permissão de administrador')) {
        setError('Você não tem permissão de administrador.');
      } else {
        setError('Ocorreu um erro ao fazer login. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <LoginCard>
        <LogoContainer>
          <LogoPlaceholder>logo</LogoPlaceholder>
        </LogoContainer>

        <Form onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}

          <FormGroup>
            <Label htmlFor="usuario">Usuário</Label>
            <Input
              id="usuario"
              type="text"
              value={usuario}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsuario(e.target.value)}
              placeholder="Usuário"
              required
              disabled={isLoading}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="senha">Senha</Label>
            <Input
              id="senha"
              type="password"
              value={senha}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSenha(e.target.value)}
              placeholder="Senha"
              required
              disabled={isLoading}
            />
          </FormGroup>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </Form>
      </LoginCard>
    </Container>
  );
}
