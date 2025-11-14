import styled from 'styled-components';

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 15px;
  flex-shrink: 0;
`;

export const UserName = styled.div`
  color: #111827;
  font-size: 15px;
  font-weight: 600;
`;

export const UserRole = styled.div`
  color: #6b7280;
  font-size: 13px;
`;
