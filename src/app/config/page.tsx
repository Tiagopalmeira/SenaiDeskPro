'use client';

import { HomeLayout } from '@/components/home/HomeLayout';
import { ProfileAvatar } from '@/components/ProfileAvatar';
import { MainContent, PageTitle } from '@/components/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const ConfigContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const ConfigCard = styled.div<{ $isDark?: boolean }>`
  background: ${props => props.$isDark ? '#1f2937' : 'white'};
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
  padding-bottom: 32px;
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label<{ $isDark?: boolean }>`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.$isDark ? '#d1d5db' : '#374151'};
  margin-bottom: 8px;
`;

const Input = styled.input<{ $isDark?: boolean }>`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${props => props.$isDark ? '#374151' : '#d1d5db'};
  border-radius: 8px;
  font-size: 15px;
  color: ${props => props.$isDark ? '#f9fafb' : '#1f2937'};
  background: ${props => props.$isDark ? '#111827' : 'white'};
  transition: all 0.2s;

  &:hover {
    border-color: ${props => props.$isDark ? '#4b5563' : '#9ca3af'};
  }

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const Select = styled.select<{ $isDark?: boolean }>`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${props => props.$isDark ? '#374151' : '#d1d5db'};
  border-radius: 8px;
  font-size: 15px;
  color: ${props => props.$isDark ? '#f9fafb' : '#1f2937'};
  background: ${props => props.$isDark ? '#111827' : 'white'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${props => props.$isDark ? '#4b5563' : '#9ca3af'};
  }

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const SaveButton = styled.button`
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

export default function ConfigPage() {
  const router = useRouter();
  const { user, logout, updateUserPhoto, updateUserName } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [nome, setNome] = useState(user?.nome || '');

  useEffect(() => {
    if (!user) {
      router.push('/');
    } else {
      setNome(user.nome);
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const getInitials = (username: string) => {
    const names = username.split(' ');
    if (names.length >= 2) {
      return names[0][0] + names[names.length - 1][0];
    }
    return username.substring(0, 2);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleSave = () => {
    updateUserName(nome);
    console.log('Alterações salvas:', { nome });
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const photoUrl = reader.result as string;
        updateUserPhoto(photoUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    const input = document.getElementById('photo-upload') as HTMLInputElement;
    input?.click();
  };

  return (
    <HomeLayout
      isCollapsed={isCollapsed}
      toggleSidebar={() => setIsCollapsed(!isCollapsed)}
      isDarkMode={isDarkMode}
      toggleTheme={toggleTheme}
      username={user.username}
      fullName={user.nome}
      photoUrl={user.photoUrl}
      getInitials={getInitials}
      handleLogout={handleLogout}
    >
      <MainContent>
        <PageTitle>Configurações</PageTitle>

        <ConfigContainer>
          <ConfigCard $isDark={isDarkMode}>
            <ProfileSection>
              <ProfileAvatar
                name={nome}
                photoUrl={user.photoUrl}
                size="large"
                editable
                onPhotoChange={triggerFileInput}
                isDark={isDarkMode}
              />
              <HiddenFileInput
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
              />
            </ProfileSection>

            <FormGroup>
              <Label htmlFor="nome" $isDark={isDarkMode}>Nome</Label>
              <Input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Digite seu nome"
                $isDark={isDarkMode}
              />
            </FormGroup>

            <SaveButton onClick={handleSave}>Salvar Alterações</SaveButton>
          </ConfigCard>
        </ConfigContainer>
      </MainContent>
    </HomeLayout>
  );
}
