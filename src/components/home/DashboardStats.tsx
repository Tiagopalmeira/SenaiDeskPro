import { DashboardGrid, StatCard, StatHeader, StatIcon, StatInfo, StatLabel, StatValue } from './HomeStyles';

interface DashboardStatsProps {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
}

export function DashboardStats({ totalTickets, openTickets, inProgressTickets, resolvedTickets }: DashboardStatsProps) {
  return (
    <DashboardGrid>
      <StatCard>
        <StatHeader>
          <StatIcon $color="#2563eb">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </StatIcon>
          <StatInfo>
            <StatLabel>Total de Chamados</StatLabel>
            <StatValue>{totalTickets}</StatValue>
          </StatInfo>
        </StatHeader>
      </StatCard>

      <StatCard>
        <StatHeader>
          <StatIcon $color="#eab308">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </StatIcon>
          <StatInfo>
            <StatLabel>Abertos</StatLabel>
            <StatValue>{openTickets}</StatValue>
          </StatInfo>
        </StatHeader>
      </StatCard>

      <StatCard>
        <StatHeader>
          <StatIcon $color="#2563eb">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </StatIcon>
          <StatInfo>
            <StatLabel>Em Andamento</StatLabel>
            <StatValue>{inProgressTickets}</StatValue>
          </StatInfo>
        </StatHeader>
      </StatCard>

      <StatCard>
        <StatHeader>
          <StatIcon $color="#22c55e">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </StatIcon>
          <StatInfo>
            <StatLabel>Resolvidos</StatLabel>
            <StatValue>{resolvedTickets}</StatValue>
          </StatInfo>
        </StatHeader>
      </StatCard>
    </DashboardGrid>
  );
}
