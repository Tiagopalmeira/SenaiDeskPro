import styled from 'styled-components';

export const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

export const StatCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
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

export const StatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

export const StatIcon = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$color};

  svg {
    width: 24px;
    height: 24px;
    color: white;
  }
`;

export const StatInfo = styled.div`
  flex: 1;
`;

export const StatLabel = styled.div`
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
  margin-bottom: 4px;

  .dark & {
    color: #9ca3af;
  }
`;

export const StatValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #111827;

  .dark & {
    color: #f9fafb;
  }
`;

export const RecentTicketsSection = styled.div`
  margin-top: 32px;
`;

export const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 16px;

  .dark & {
    color: #f9fafb;
  }
`;

export const TicketsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const TicketItem = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #2563eb;
    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.1);
  }

  .dark & {
    background: #1f2937;
    border-color: #374151;

    &:hover {
      border-color: #3b82f6;
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
    }
  }
`;

export const TicketStatus = styled.div<{ $status: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${props => {
    switch (props.$status) {
      case 'aberto': return '#eab308';
      case 'em_andamento': return '#2563eb';
      case 'resolvido': return '#22c55e';
      case 'fechado': return '#6b7280';
      default: return '#6b7280';
    }
  }};
`;

export const TicketInfo = styled.div`
  flex: 1;
`;

export const TicketTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;

  .dark & {
    color: #f9fafb;
  }
`;

export const TicketMeta = styled.div`
  font-size: 12px;
  color: #6b7280;

  .dark & {
    color: #9ca3af;
  }
`;

export const TicketId = styled.span`
  font-weight: 600;
  color: #2563eb;

  .dark & {
    color: #60a5fa;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 48px 32px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;

  .dark & {
    background: #1f2937;
    border-color: #374151;
  }
`;

export const EmptyIcon = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 32px;
    height: 32px;
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
  font-size: 16px;
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
