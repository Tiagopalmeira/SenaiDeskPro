import { Ticket } from '@/utils/mocks/tickets';
import React from 'react';
import {
  MetaLabel,
  MetaValue,
  PriorityIndicator,
  StatusBadge,
  TicketCardContainer,
  TicketDescription,
  TicketFooter,
  TicketHeader,
  TicketId,
  TicketMeta,
  TicketTitle
} from './ChamadosStyles';

interface TicketCardProps {
  ticket: Ticket;
  statusLabels: Record<string, string>;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, statusLabels }) => {
  return (
    <TicketCardContainer>
      <TicketHeader>
        <TicketId>{ticket.id}</TicketId>
        <StatusBadge $status={ticket.status}>
          {statusLabels[ticket.status]}
        </StatusBadge>
      </TicketHeader>

      <TicketTitle>{ticket.title}</TicketTitle>
      <TicketDescription>{ticket.description}</TicketDescription>

      <TicketFooter>
        <TicketMeta>
          <MetaLabel>Responsável</MetaLabel>
          <MetaValue>{ticket.assignee}</MetaValue>
        </TicketMeta>

        <TicketMeta>
          <MetaLabel>Abertura</MetaLabel>
          <MetaValue>{ticket.created}</MetaValue>
        </TicketMeta>

        <TicketMeta>
          <MetaLabel>Última Att.</MetaLabel>
          <MetaValue>
            {ticket.created === ticket.lastUpdate
              ? 'Não modificado'
              : ticket.lastUpdate
            }
          </MetaValue>
        </TicketMeta>

        <TicketMeta style={{ alignItems: 'flex-end' }}>
          <MetaLabel>Prioridade</MetaLabel>
          <PriorityIndicator $priority={ticket.priority} />
        </TicketMeta>
      </TicketFooter>
    </TicketCardContainer>
  );
};
