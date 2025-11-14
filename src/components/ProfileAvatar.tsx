import styled from 'styled-components';

interface ProfileAvatarProps {
  name: string;
  photoUrl?: string;
  size?: 'small' | 'medium' | 'large';
  editable?: boolean;
  onPhotoChange?: () => void;
  isDark?: boolean;
}

const AvatarContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const Avatar = styled.div<{ $size: 'small' | 'medium' | 'large' }>`
  ${props => {
    const sizes = {
      small: { width: '40px', height: '40px', fontSize: '16px' },
      medium: { width: '80px', height: '80px', fontSize: '32px' },
      large: { width: '120px', height: '120px', fontSize: '48px' },
    };
    const size = sizes[props.$size];
    return `
      width: ${size.width};
      height: ${size.height};
      font-size: ${size.fontSize};
    `;
  }}
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  user-select: none;
  position: relative;
  overflow: hidden;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
`;

const EditButton = styled.button<{ $isDark?: boolean }>`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: 3px solid ${props => props.$isDark ? '#1f2937' : 'white'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  svg {
    width: 18px;
    height: 18px;
    color: white;
  }

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
`;

export function ProfileAvatar({ name, photoUrl, size = 'medium', editable = false, onPhotoChange, isDark = false }: ProfileAvatarProps) {
  const getInitials = (fullName: string) => {
    const names = fullName.trim().split(' ');
    if (names.length >= 2) {
      return names[0][0] + names[names.length - 1][0];
    }
    return fullName.substring(0, 2);
  };

  return (
    <AvatarContainer>
      <Avatar $size={size}>
        {photoUrl ? (
          <AvatarImage src={photoUrl} alt={name} />
        ) : (
          getInitials(name)
        )}
      </Avatar>
      {editable && (
        <EditButton $isDark={isDark} onClick={onPhotoChange} type="button">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </EditButton>
      )}
    </AvatarContainer>
  );
}
