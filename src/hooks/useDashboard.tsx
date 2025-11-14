import { Ticket } from '@/utils/mocks/tickets';
import { useMemo } from 'react';

/**
 * Dados mock de tickets para desenvolvimento
 * TODO: Substituir por chamada à API real quando backend estiver pronto
 */
const mockTickets: Ticket[] = [
  {
    id: '#12345',
    title: 'Problema no sistema de login',
    description: 'Usuários relatam lentidão ao fazer login no sistema. O tempo de resposta está acima de 10 segundos.',
    status: 'aberto',
    priority: 'alta',
    assignee: 'admin',
    createdBy: 'user',
    created: '14/11/2025',
    lastUpdate: '14/11/2025',
    category: 'Sistema',
  },
  {
    id: '#12344',
    title: 'Atualização de cadastro não salva',
    description: 'Ao tentar atualizar dados cadastrais, as informações não são salvas no banco de dados.',
    status: 'em_andamento',
    priority: 'alta',
    assignee: 'admin',
    createdBy: 'user',
    created: '13/11/2025',
    lastUpdate: '14/11/2025',
    category: 'Banco de Dados',
  },
  {
    id: '#12343',
    title: 'Erro ao gerar relatório mensal',
    description: 'Sistema retorna erro 500 ao tentar gerar o relatório de vendas do mês.',
    status: 'em_andamento',
    priority: 'média',
    assignee: 'admin',
    createdBy: 'user',
    created: '13/11/2025',
    lastUpdate: '13/11/2025',
    category: 'Relatórios',
  },
  {
    id: '#12342',
    title: 'Interface não responsiva em mobile',
    description: 'O layout da página de produtos não se adapta corretamente em dispositivos móveis.',
    status: 'aberto',
    priority: 'média',
    assignee: 'admin',
    createdBy: 'user',
    created: '12/11/2025',
    lastUpdate: '12/11/2025',
    category: 'Interface',
  },
];

/**
 * Props necessárias para o hook useDashboard
 */
interface UseDashboardProps {
  username: string;  // Nome do usuário logado
  isAdmin: boolean;  // Se o usuário tem privilégios de administrador
}

/**
 * Hook customizado para gerenciar dados do dashboard
 *
 * @description
 * Este hook é responsável por:
 * - Filtrar tickets baseado no perfil do usuário (admin vê tickets atribuídos a ele, usuário vê tickets criados por ele)
 * - Calcular estatísticas agregadas (total, abertos, em andamento, resolvidos)
 * - Retornar lista de tickets recentes (máximo 5)
 * - Utilizar useMemo para otimização de performance
 *
 * @example
 * ```tsx
 * function Dashboard() {
 *   const { stats, recentTickets } = useDashboard({
 *     username: 'João Silva',
 *     isAdmin: true
 *   });
 *
 *   return (
 *     <div>
 *       <h2>Total: {stats.totalTickets}</h2>
 *       <h3>Abertos: {stats.openTickets}</h3>
 *       {recentTickets.map(ticket => (
 *         <TicketCard key={ticket.id} {...ticket} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 *
 * @param {UseDashboardProps} props - Configurações do dashboard
 * @param {string} props.username - Nome do usuário logado
 * @param {boolean} props.isAdmin - Se o usuário é administrador
 *
 * @returns {Object} Dados do dashboard
 * @returns {Object} stats - Estatísticas agregadas
 * @returns {number} stats.totalTickets - Total de tickets do usuário
 * @returns {number} stats.openTickets - Quantidade de tickets com status 'aberto'
 * @returns {number} stats.inProgressTickets - Quantidade de tickets com status 'em_andamento'
 * @returns {number} stats.resolvedTickets - Quantidade de tickets resolvidos ou fechados
 * @returns {Ticket[]} recentTickets - Lista dos 5 tickets mais recentes do usuário
 */
export function useDashboard({ username, isAdmin }: UseDashboardProps) {
  /**
   * Filtra os tickets relevantes para o usuário atual
   * - Admin: vê apenas tickets onde ele é o responsável (assignee)
   * - Usuário comum: vê apenas tickets que ele criou (createdBy)
   *
   * Utiliza useMemo para evitar recalcular a cada render
   * Recalcula apenas quando username ou isAdmin mudam
   */
  const userTickets = useMemo(() => {
    return isAdmin
      ? mockTickets.filter(ticket => ticket.assignee === username) // Admin vê apenas os destinados a ele
      : mockTickets.filter(ticket => ticket.createdBy === username); // User vê apenas os que ele criou
  }, [username, isAdmin]);

  /**
   * Calcula estatísticas agregadas dos tickets do usuário
   * - totalTickets: quantidade total de tickets
   * - openTickets: tickets com status 'aberto'
   * - inProgressTickets: tickets com status 'em_andamento'
   * - resolvedTickets: tickets com status 'resolvido' ou 'fechado'
   *
   * Utiliza useMemo para evitar recalcular a cada render
   * Recalcula apenas quando a lista de userTickets muda
   */
  const stats = useMemo(() => {
    const totalTickets = userTickets.length;
    const openTickets = userTickets.filter(t => t.status === 'aberto').length;
    const inProgressTickets = userTickets.filter(t => t.status === 'em_andamento').length;
    const resolvedTickets = userTickets.filter(t => t.status === 'resolvido' || t.status === 'fechado').length;

    return {
      totalTickets,
      openTickets,
      inProgressTickets,
      resolvedTickets,
    };
  }, [userTickets]);

  /**
   * Retorna os 5 tickets mais recentes do usuário
   * Como a lista já vem ordenada por data, apenas limita a 5 itens
   *
   * Utiliza useMemo para evitar criar novo array a cada render
   * Recalcula apenas quando a lista de userTickets muda
   */
  const recentTickets = useMemo(() => {
    return userTickets.slice(0, 5);
  }, [userTickets]);

  return {
    stats,
    recentTickets,
  };
}
