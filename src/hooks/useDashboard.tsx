import { useEffect, useState } from "react";
import { listarSolicitacoes, Solicitacao, SolicitacaoFilters } from "@/api_requests/solicitacoes";
import { listarMovimentacoes } from "@/api_requests/movimentacoes";
import { buscarUsuarioPorId } from "@/api_requests/usuarios";
import { formatDateBR } from "@/utils/dateHelpers";

type TicketStatus = "aberto" | "em_andamento" | "resolvido" | "fechado";
type TicketPriority = "baixa" | "média" | "alta";

interface DashboardTicket {
    id: string;
    title: string;
    status: TicketStatus;
    priority: TicketPriority;
    assignee: string;
    createdBy: string;
    created: string;
}

interface DashboardStats {
    totalTickets: number;
    openTickets: number;
    inProgressTickets: number;
    resolvedTickets: number;
}

/**
 * Props necessárias para o hook useDashboard
 */
interface UseDashboardProps {
    userId: number;
    username: string;
    isAdmin: boolean;
    userCargo?: string;
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
export function useDashboard({ userId, username, isAdmin, userCargo }: UseDashboardProps) {
    const [stats, setStats] = useState<DashboardStats>();
    const [recentTickets, setRecentTickets] = useState<DashboardTicket[]>([]);

    useEffect(() => {
        let isCancelled = false;

        const statusLabels: Record<number, TicketStatus> = {
            0: "aberto",
            1: "em_andamento",
            2: "resolvido",
        };

        const priorityLabels: Record<number, TicketPriority> = {
            0: "baixa",
            1: "média",
            2: "alta",
        };

        const loadDashboard = async () => {
            if (!userId) {
                setStats(undefined);
                setRecentTickets([]);
                return;
            }

            try {
                const filters: SolicitacaoFilters = {};

                if (isAdmin) {
                    if (userCargo && userCargo.trim().length > 0) {
                        filters.area = userCargo;
                    }
                } else {
                    filters.usuarioId = String(userId);
                }

                const solicitacoesResponse = await listarSolicitacoes(filters);
                let solicitacoes = solicitacoesResponse.data?.solicitacoes ?? [];

                const statusCache = new Map<
                    number,
                    { status: number; updatedAt: string | null; responsavelId: number | null }
                >();

                const getUltimaMovimentacao = async (solicitacaoId: number) => {
                    if (statusCache.has(solicitacaoId)) {
                        return statusCache.get(solicitacaoId)!;
                    }

                    const response = await listarMovimentacoes({ solicitacaoId: String(solicitacaoId) });
                    const movimentacoes = response.data.movimentacoes;

                    if (movimentacoes.length === 0) {
                        const fallback = { status: 0, updatedAt: null, responsavelId: null };
                        statusCache.set(solicitacaoId, fallback);
                        return fallback;
                    }

                    const ultimaMovimentacao = [...movimentacoes].sort(
                        (a, b) => new Date(b.data_atualizacao).getTime() - new Date(a.data_atualizacao).getTime()
                    )[0];

                    const result = {
                        status: ultimaMovimentacao.status,
                        updatedAt: ultimaMovimentacao.data_atualizacao,
                        responsavelId: ultimaMovimentacao.id_usuario ?? null,
                    };

                    statusCache.set(solicitacaoId, result);
                    return result;
                };

                if (isAdmin) {
                    const movimentacoesAdmin = await listarMovimentacoes({ usuarioId: String(userId) });
                    const idsAtribuidos = new Set(
                        movimentacoesAdmin.data.movimentacoes.map((mov) => mov.id_solicitacao)
                    );

                    const filtradas: Solicitacao[] = [];

                    for (const solicitacao of solicitacoes) {
                        if (idsAtribuidos.has(solicitacao.id_solicitacao)) {
                            filtradas.push(solicitacao);
                            continue;
                        }

                        const ultima = await getUltimaMovimentacao(solicitacao.id_solicitacao);

                        if (ultima.status === 0 && (ultima.responsavelId === null || ultima.responsavelId === userId)) {
                            filtradas.push(solicitacao);
                        }
                    }

                    solicitacoes = filtradas;
                }

                const solicitacoesComStatus = await Promise.all(
                    solicitacoes.map(async (solicitacao) => {
                        const ultima = await getUltimaMovimentacao(solicitacao.id_solicitacao);
                        return {
                            solicitacao,
                            ultima,
                        };
                    })
                );

                const totalTickets = solicitacoesComStatus.length;
                const openTickets = solicitacoesComStatus.filter((item) => item.ultima.status === 0).length;
                const inProgressTickets = solicitacoesComStatus.filter((item) => item.ultima.status === 1).length;
                const resolvedTickets = solicitacoesComStatus.filter((item) => item.ultima.status === 2).length;

                const statsData: DashboardStats = {
                    totalTickets,
                    openTickets,
                    inProgressTickets,
                    resolvedTickets,
                };

                const sortedRecent = [...solicitacoesComStatus].sort((a, b) => {
                    const dateA = new Date(a.ultima.updatedAt || a.solicitacao.data_abertura).getTime() || 0;
                    const dateB = new Date(b.ultima.updatedAt || b.solicitacao.data_abertura).getTime() || 0;
                    return dateB - dateA;
                });

                const getUserName = async (id: number) => {
                    try {
                        const response = await buscarUsuarioPorId(id);
                        return response.data.usuario.nome;
                    } catch {
                        return `Usuário #${id}`;
                    }
                };

                const recentTicketsData: DashboardTicket[] = [];

                for (const item of sortedRecent.slice(0, 5)) {
                    const creatorName = await getUserName(item.solicitacao.id_usuario);
                    recentTicketsData.push({
                        id: `#${item.solicitacao.id_solicitacao}`,
                        title: item.solicitacao.descricao,
                        status: statusLabels[item.ultima.status] ?? "fechado",
                        priority: priorityLabels[item.solicitacao.prioridade] ?? "média",
                        assignee: username,
                        createdBy: creatorName,
                        created: formatDateBR(item.solicitacao.data_abertura),
                    });
                }

                if (!isCancelled) {
                    setStats(statsData);
                    setRecentTickets(recentTicketsData);
                }
            } catch (error) {
                if (!isCancelled) {
                    setStats(undefined);
                    setRecentTickets([]);
                }
                console.error("Erro ao carregar dados do dashboard:", error);
            }
        };

        loadDashboard();

        return () => {
            isCancelled = true;
        };
    }, [userId, username, isAdmin, userCargo]);

    return {
        stats,
        recentTickets,
    };
}
