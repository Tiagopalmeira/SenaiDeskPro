import { Ticket } from '@/utils/mocks/tickets';
import { useMemo, useState } from 'react';

/**
 * Props necessárias para o hook useTickets
 */
interface UseTicketsProps {
  tickets: Ticket[];   // Lista completa de tickets a serem filtrados
  username: string;    // Nome do usuário logado
  isAdmin: boolean;    // Se o usuário tem privilégios de administrador
}

/**
 * Hook customizado para gerenciar a lista de tickets com filtros e busca
 *
 * @description
 * Este hook é responsável por:
 * - Gerenciar estados de busca e filtros (status, prioridade)
 * - Filtrar tickets por usuário (admin vê atribuídos, user vê criados)
 * - Filtrar por termo de busca (título, descrição, ID)
 * - Filtrar por status e prioridade
 * - Ordenar tickets por status (aberto > em andamento > resolvido > fechado) e então por prioridade (alta > média > baixa)
 * - Utilizar useMemo para otimização de performance
 *
 * @example
 * ```tsx
 * function TicketsPage() {
 *   const { user } = useAuth();
 *   const {
 *     searchTerm,
 *     setSearchTerm,
 *     statusFilter,
 *     setStatusFilter,
 *     priorityFilter,
 *     setPriorityFilter,
 *     filteredTickets
 *   } = useTickets({
 *     tickets: mockTickets,
 *     username: user.username,
 *     isAdmin: user.isAdmin
 *   });
 *
 *   return (
 *     <div>
 *       <input
 *         value={searchTerm}
 *         onChange={(e) => setSearchTerm(e.target.value)}
 *         placeholder="Buscar por título, descrição ou ID..."
 *       />
 *       <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
 *         <option value="todos">Todos os status</option>
 *         <option value="aberto">Aberto</option>
 *         <option value="em_andamento">Em Andamento</option>
 *         <option value="resolvido">Resolvido</option>
 *         <option value="fechado">Fechado</option>
 *       </select>
 *       <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
 *         <option value="todas">Todas as prioridades</option>
 *         <option value="alta">Alta</option>
 *         <option value="média">Média</option>
 *         <option value="baixa">Baixa</option>
 *       </select>
 *       {filteredTickets.map(ticket => (
 *         <TicketCard key={ticket.id} {...ticket} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 *
 * @param {UseTicketsProps} props - Configurações do filtro de tickets
 * @param {Ticket[]} props.tickets - Lista completa de tickets a serem filtrados
 * @param {string} props.username - Nome do usuário logado
 * @param {boolean} props.isAdmin - Se o usuário é administrador
 *
 * @returns {Object} Estado e funções de controle
 * @returns {string} searchTerm - Termo atual de busca
 * @returns {(term: string) => void} setSearchTerm - Função para atualizar o termo de busca
 * @returns {string} statusFilter - Filtro atual de status ('todos' | 'aberto' | 'em_andamento' | 'resolvido' | 'fechado')
 * @returns {(status: string) => void} setStatusFilter - Função para atualizar filtro de status
 * @returns {string} priorityFilter - Filtro atual de prioridade ('todas' | 'alta' | 'média' | 'baixa')
 * @returns {(priority: string) => void} setPriorityFilter - Função para atualizar filtro de prioridade
 * @returns {Ticket[]} filteredTickets - Lista de tickets filtrados e ordenados
 */
export const useTickets = ({ tickets, username, isAdmin }: UseTicketsProps) => {
  // Estado local para termo de busca (pesquisa por título, descrição ou ID)
  const [searchTerm, setSearchTerm] = useState('');

  // Estado local para filtro de status (todos, aberto, em_andamento, resolvido, fechado)
  const [statusFilter, setStatusFilter] = useState('todos');

  // Estado local para filtro de prioridade (todas, alta, média, baixa)
  const [priorityFilter, setPriorityFilter] = useState('todas');

  /**
   * Filtra e ordena os tickets com base nos critérios definidos
   *
   * Pipeline de filtros aplicados em ordem:
   * 1. Filtro de usuário (admin vê assignee, user vê createdBy)
   * 2. Filtro de busca (título, descrição ou ID contém o termo)
   * 3. Filtro de status (se não for 'todos')
   * 4. Filtro de prioridade (se não for 'todas')
   *
   * Após filtragem, aplica ordenação:
   * 1. Primeiro por status (aberto > em_andamento > resolvido > fechado)
   * 2. Depois por prioridade (alta > média > baixa)
   *
   * Utiliza useMemo para recalcular apenas quando alguma dependência muda
   */
  const filteredTickets = useMemo(() => {
    return tickets
      .filter(ticket => {
        // 1. Verifica se o ticket pertence ao usuário atual
        const matchesUser = isAdmin
          ? ticket.assignee === username    // Admin vê tickets atribuídos a ele
          : ticket.createdBy === username;  // User vê tickets criados por ele

        // 2. Verifica se o termo de busca está presente no título, descrição ou ID
        const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.id.toLowerCase().includes(searchTerm.toLowerCase());

        // 3. Verifica se o status corresponde ao filtro selecionado
        const matchesStatus = statusFilter === 'todos' || ticket.status === statusFilter;

        // 4. Verifica se a prioridade corresponde ao filtro selecionado
        const matchesPriority = priorityFilter === 'todas' || ticket.priority === priorityFilter;

        // Ticket deve passar por TODOS os filtros
        return matchesUser && matchesSearch && matchesStatus && matchesPriority;
      })
      .sort((a, b) => {
        // Define ordem de prioridade para status (menor número = maior prioridade)
        const statusOrder: Record<string, number> = {
          aberto: 1,        // Tickets abertos aparecem primeiro
          em_andamento: 2,  // Depois tickets em andamento
          resolvido: 3,     // Depois resolvidos
          fechado: 4        // Por último, fechados
        };

        // Calcula diferença de status entre dois tickets
        const statusDiff = statusOrder[a.status] - statusOrder[b.status];

        // Se os status são diferentes, ordena por status
        if (statusDiff !== 0) {
          return statusDiff;
        }

        // Se os status são iguais, ordena por prioridade
        const priorityOrder: Record<string, number> = {
          alta: 1,    // Alta prioridade primeiro
          média: 2,   // Depois média
          baixa: 3    // Por último, baixa
        };

        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
  }, [tickets, username, isAdmin, searchTerm, statusFilter, priorityFilter]);

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    filteredTickets
  };
};
