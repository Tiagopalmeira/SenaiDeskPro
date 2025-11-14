import styled from 'styled-components';

export const FilterBar = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  align-items: center;
`;

export const SearchInput = styled.input`
  flex: 1;
  min-width: 300px;
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #111827;
  background: white;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }

  .dark & {
    background: #1f2937;
    border-color: #374151;
    color: #f9fafb;

    &:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    &::placeholder {
      color: #6b7280;
    }
  }
`;

export const FilterSelect = styled.select`
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #111827;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #2563eb;
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

export const NewTicketButton = styled.button`
  padding: 12px 24px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: #1d4ed8;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const TicketsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 20px;
`;

export const TicketCardContainer = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #2563eb;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
    transform: translateY(-2px);
  }

  .dark & {
    background: #1f2937;
    border-color: #374151;

    &:hover {
      border-color: #3b82f6;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
    }
  }
`;

export const TicketHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

export const TicketId = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;

  .dark & {
    color: #9ca3af;
  }
`;

export const StatusBadge = styled.span<{ $status: string }>`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => {
    switch (props.$status) {
      case 'aberto': return 'rgba(234, 179, 8, 0.1)';
      case 'em_andamento': return 'rgba(37, 99, 235, 0.1)';
      case 'resolvido': return 'rgba(34, 197, 94, 0.1)';
      case 'fechado': return 'rgba(107, 114, 128, 0.1)';
      default: return 'rgba(107, 114, 128, 0.1)';
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'aberto': return '#eab308';
      case 'em_andamento': return '#2563eb';
      case 'resolvido': return '#22c55e';
      case 'fechado': return '#6b7280';
      default: return '#6b7280';
    }
  }};
`;

export const TicketTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 8px;
  line-height: 1.4;

  .dark & {
    color: #f9fafb;
  }
`;

export const TicketDescription = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 16px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  .dark & {
    color: #9ca3af;
  }
`;

export const TicketFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;

  .dark & {
    border-top-color: #374151;
  }
`;

export const TicketMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const MetaLabel = styled.span`
  font-size: 12px;
  color: #9ca3af;

  .dark & {
    color: #6b7280;
  }
`;

export const MetaValue = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #111827;

  .dark & {
    color: #f9fafb;
  }
`;

export const PriorityIndicator = styled.div<{ $priority: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => {
    switch (props.$priority) {
      case 'alta': return '#ef4444';
      case 'média': return '#eab308';
      case 'baixa': return '#22c55e';
      default: return '#6b7280';
    }
  }};
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 64px 32px;
`;

export const EmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 16px;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 40px;
    height: 40px;
    color: #9ca3af;
  }

  .dark & {
    background: #374151;

    svg {
      color: #6b7280;
    }
  }
`;

export const EmptyTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 8px;

  .dark & {
    color: #f9fafb;
  }
`;

export const EmptyDescription = styled.p`
  font-size: 14px;
  color: #6b7280;

  .dark & {
    color: #9ca3af;
  }
`;
