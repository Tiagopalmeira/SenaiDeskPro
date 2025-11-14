'use client';

import { Button } from '@/components/Button';
import { Input, Label } from '@/components/Input';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const BackgroundWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;

  img {
    object-fit: cover;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to left, rgba(14, 65, 148, 0.8) 0%, rgba(14, 65, 148, 0.5) 50%, transparent 100%);
  }
`;

const LoginCard = styled.div`
  background: white;
  padding: 48px 40px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 420px;
  position: relative;
  z-index: 10;
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  margin-top: 10px;
`;

const SwitchWrapper = styled.label`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  cursor: pointer;
`;

const SwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: #2563eb;
  }

  &:checked + span:before {
    transform: translateX(20px);
  }
`;

const SwitchSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5e1;
  transition: 0.3s;
  border-radius: 24px;

  &:before {
    position: absolute;
    content: '';
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
  }
`;

const SwitchLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
`;

const ErrorMessage = styled.div`
  background: #fee2e2;
  color: #991b1b;
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 14px;
  margin-bottom: 16px;
  border: 1px solid #fecaca;
`;

const SuccessMessage = styled.div`
  background: #d1fae5;
  color: #065f46;
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 14px;
  margin-bottom: 16px;
  border: 1px solid #a7f3d0;
`;

export default function Home() {
  const { login, isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(usuario, senha, isAdmin);

      if (success) {
        router.push('/home');
      } else {
        setError('Usuário ou senha inválidos. Por favor, verifique suas credenciais.');
      }
    } catch (err: any) {
      if (err.message?.includes('permissão de administrador')) {
        setError('🔒 Acesso de administrador negado. Seu cargo não permite entrar como administrador. Desmarque a opção e entre como usuário normal.');
      } else if (err.message?.includes('404') || err.message?.includes('500')) {
        setError('O sistema está temporariamente indisponível. Tente novamente em alguns instantes.');
      } else if (err.message?.includes('Network') || err.message?.includes('fetch')) {
        setError('Parece que você está sem conexão. Verifique sua internet e tente novamente.');
      } else {
        setError('Não foi possível realizar o login. Tente novamente ou entre em contato com o suporte.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated && user) {
    router.push('/home');
    return null;
  }

  return (
    <Container>
      <BackgroundWrapper>
        <Image
          src="/image/institucional.png"
          alt="Background"
          fill
          sizes="100vw"
          style={{ objectFit: 'cover' }}
          priority
          quality={100}
        />
      </BackgroundWrapper>
      <LoginCard>
        <LogoContainer>
          <Image
            src="/image/logo.png"
            alt="Logo"
            width={150}
            height={50}
            priority
          />
        </LogoContainer>

        <Form onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}

          <FormGroup>
            <Label htmlFor="usuario">Usuário</Label>
            <Input
              id="usuario"
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Digite seu usuário"
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
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite sua senha"
              required
              disabled={isLoading}
            />
          </FormGroup>

          <SwitchContainer>
            <SwitchWrapper>
              <SwitchInput
                type="checkbox"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                disabled={isLoading}
              />
              <SwitchSlider />
            </SwitchWrapper>
            <SwitchLabel>Sou administrador</SwitchLabel>
          </SwitchContainer>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </Form>
      </LoginCard>
    </Container>
  );
}
