import { useRouter } from 'next/navigation';
import { EmptyDescription, EmptyIcon, EmptyState, EmptyTitle, RecentTicketsSection, SectionTitle, TicketId, TicketInfo, TicketItem, TicketMeta, TicketsList, TicketStatus, TicketTitle } from './HomeStyles';

interface Ticket {
  id: string;
  title: string;
  status: string;
  priority: string;
  assignee: string;
  createdBy: string;
  created: string;
}

interface RecentTicketsProps {
  tickets: Ticket[];
  isAdmin: boolean;
}

export function RecentTickets({ tickets, isAdmin }: RecentTicketsProps) {
  const router = useRouter();

  return (
    <RecentTicketsSection>
      <SectionTitle>
        {isAdmin ? 'Chamados Atribuídos a Você' : 'Seus Chamados Recentes'}
      </SectionTitle>

      {tickets.length > 0 ? (
        <TicketsList>
          {tickets.map((ticket) => (
            <TicketItem key={ticket.id} onClick={() => router.push('/chamados')}>
              <TicketStatus $status={ticket.status} />
              <TicketInfo>
                <TicketTitle>{ticket.title}</TicketTitle>
                <TicketMeta>
                  <TicketId>{ticket.id}</TicketId> • {ticket.created} • Prioridade: {ticket.priority}
                  {isAdmin && ` • Criado por: ${ticket.createdBy}`}
                </TicketMeta>
              </TicketInfo>
            </TicketItem>
          ))}
        </TicketsList>
      ) : (
        <EmptyState>
          <EmptyIcon>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </EmptyIcon>
          <EmptyTitle>Nenhum chamado encontrado</EmptyTitle>
          <EmptyDescription>
            {isAdmin
              ? 'Não há chamados atribuídos a você no momento.'
              : 'Você ainda não abriu nenhum chamado.'}
          </EmptyDescription>
        </EmptyState>
      )}
    </RecentTicketsSection>
  );
}
