import styled from 'styled-components';

export const ContentText = styled.p`
  font-size: 16px;
  color: #6b7280;
  transition: color 0.3s ease;

  .dark & {
    color: #9ca3af;
  }

  strong {
    color: #111827;
    transition: color 0.3s ease;

    .dark & {
      color: #f9fafb;
    }
  }
`;
