import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 32px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .dark & {
    background: #1f2937;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;

  .dark & {
    border-bottom-color: #374151;
  }
`;

export const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;

  .dark & {
    color: #f9fafb;
  }
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 28px;
  color: #9ca3af;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
    color: #374151;
  }

  .dark &:hover {
    background: #374151;
    color: #f9fafb;
  }
`;

export const DetailSection = styled.div`
  margin-bottom: 24px;
`;

export const DetailLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  display: block;
  margin-bottom: 8px;

  .dark & {
    color: #9ca3af;
  }
`;

export const DetailValue = styled.div`
  font-size: 16px;
  color: #111827;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;

  .dark & {
    background: #374151;
    border-color: #4b5563;
    color: #f9fafb;
  }
`;

export const StatusBadge = styled.span<{ $status: number }>`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => {
    switch (props.$status) {
      case 0: return 'rgba(234, 179, 8, 0.1)';
      case 1: return 'rgba(37, 99, 235, 0.1)';
      case 2: return 'rgba(34, 197, 94, 0.1)';
      default: return 'rgba(107, 114, 128, 0.1)';
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 0: return '#eab308';
      case 1: return '#2563eb';
      case 2: return '#22c55e';
      default: return '#6b7280';
    }
  }};
`;

export const PriorityBadge = styled.span<{ $priority: number }>`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => {
    switch (props.$priority) {
      case 0: return 'rgba(34, 197, 94, 0.1)';
      case 1: return 'rgba(234, 179, 8, 0.1)';
      case 2: return 'rgba(239, 68, 68, 0.1)';
      default: return 'rgba(107, 114, 128, 0.1)';
    }
  }};
  color: ${props => {
    switch (props.$priority) {
      case 0: return '#22c55e';
      case 1: return '#eab308';
      case 2: return '#ef4444';
      default: return '#6b7280';
    }
  }};
`;

export const FormGroup = styled.div`
  margin-bottom: 20px;
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  display: block;
  margin-bottom: 8px;

  .dark & {
    color: #9ca3af;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #111827;
  background: white;
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  .dark & {
    background: #1f2937;
    border-color: #374151;
    color: #f9fafb;

    &:focus {
      border-color: #3b82f6;
    }
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #111827;
  background: white;
  font-family: inherit;
  resize: vertical;
  min-height: 120px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  .dark & {
    background: #1f2937;
    border-color: #374151;
    color: #f9fafb;

    &:focus {
      border-color: #3b82f6;
    }
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

export const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;

  ${props => {
    switch (props.$variant) {
      case 'primary':
        return `
          background: #2563eb;
          color: white;
          &:hover {
            background: #1d4ed8;
          }
        `;
      case 'secondary':
        return `
          background: #f3f4f6;
          color: #374151;
          &:hover {
            background: #e5e7eb;
          }
          .dark & {
            background: #374151;
            color: #f9fafb;
            &:hover {
              background: #4b5563;
            }
          }
        `;
      case 'danger':
        return `
          background: #ef4444;
          color: white;
          &:hover {
            background: #dc2626;
          }
        `;
      default:
        return `
          background: #2563eb;
          color: white;
          &:hover {
            background: #1d4ed8;
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

export const ErrorMessage = styled.div`
  padding: 12px;
  background: #fee2e2;
  color: #991b1b;
  border-radius: 8px;
  margin-bottom: 16px;
`;

export const SuccessMessage = styled.div`
  padding: 12px;
  background: #d1fae5;
  color: #065f46;
  border-radius: 8px;
  margin-bottom: 16px;
`;

