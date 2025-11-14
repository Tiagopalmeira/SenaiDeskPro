import { useEffect, useState } from "react";
import { listarSolicitacoes, Solicitacao, buscarSolicitacaoPorId } from "@/api_requests/solicitacoes";
import { listarMovimentacoes, Movimentacao } from "@/api_requests/movimentacoes";
import { buscarUsuarioPorId } from "@/api_requests/usuarios";
import { formatDateBR } from "@/utils/dateHelpers";

type TicketStatus = "aberto" | "em_andamento" | "resolvido" | "fechado";
type TicketPriority = "baixa" | "média" | "alta";

interface DashboardTicket {
    id: string;
    title: string;
    status: TicketStatus;
    statusCode: 0 | 1 | 2;
    priority: TicketPriority;
    assignee: string;
    createdBy: string;
    created: string;
    updatedAt: string;
    updatedAtValue: number;
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
export function useDashboard({ userId, username, isAdmin }: UseDashboardProps) {
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

        const usuarioNomeCache = new Map<number, string>();
        const getUsuarioNome = async (id: number) => {
            if (usuarioNomeCache.has(id)) {
                return usuarioNomeCache.get(id)!;
            }
            try {
                const response = await buscarUsuarioPorId(id);
                const nome = response.data.usuario.nome;
                usuarioNomeCache.set(id, nome);
                return nome;
            } catch {
                return `Usuário #${id}`;
            }
        };

        const montarTicket = async (
            solicitacao: Solicitacao,
            ultimaMovimentacao?: Movimentacao | null
        ): Promise<DashboardTicket> => {
            const statusCode = (ultimaMovimentacao?.status ?? 0) as 0 | 1 | 2;
            const createdBy = await getUsuarioNome(solicitacao.id_usuario);
            const responsavelNome = ultimaMovimentacao?.id_usuario
                ? await getUsuarioNome(ultimaMovimentacao.id_usuario)
                : "Não atribuído";

            const updatedAtRaw = ultimaMovimentacao?.data_atualizacao || solicitacao.data_abertura;

            return {
                id: `#${solicitacao.id_solicitacao}`,
                title: solicitacao.descricao,
                status: statusLabels[statusCode] ?? "aberto",
                statusCode,
                priority: priorityLabels[solicitacao.prioridade] ?? "média",
                assignee: responsavelNome,
                createdBy,
                created: formatDateBR(solicitacao.data_abertura),
                updatedAt: formatDateBR(updatedAtRaw),
                updatedAtValue: new Date(updatedAtRaw).getTime(),
            };
        };

        const calcularStats = (tickets: DashboardTicket[]): DashboardStats => {
            const totalTickets = tickets.length;
            const openTickets = tickets.filter((t) => t.statusCode === 0).length;
            const inProgressTickets = tickets.filter((t) => t.statusCode === 1).length;
            const resolvedTickets = tickets.filter((t) => t.statusCode === 2).length;

            return {
                totalTickets,
                openTickets,
                inProgressTickets,
                resolvedTickets,
            };
        };

        const loadDashboard = async () => {
            if (!userId) {
                setStats(undefined);
                setRecentTickets([]);
                return;
            }

            try {
                let tickets: DashboardTicket[] = [];

                if (isAdmin) {
                    const movimentacoesResp = await listarMovimentacoes({ usuarioId: String(userId) });
                    const movimentacoes = movimentacoesResp.data.movimentacoes;

                    const ultimaMovPorSolicitacao = new Map<number, Movimentacao>();
                    movimentacoes.forEach((mov) => {
                        const atual = ultimaMovPorSolicitacao.get(mov.id_solicitacao);
                        if (
                            !atual ||
                            new Date(mov.data_atualizacao).getTime() > new Date(atual.data_atualizacao).getTime()
                        ) {
                            ultimaMovPorSolicitacao.set(mov.id_solicitacao, mov);
                        }
                    });

                    const solicitacoesIds = Array.from(ultimaMovPorSolicitacao.entries())
                        .filter(([, mov]) => mov.id_usuario === userId)
                        .map(([id]) => id);

                    if (solicitacoesIds.length === 0) {
                        if (!isCancelled) {
                            setStats({
                                totalTickets: 0,
                                openTickets: 0,
                                inProgressTickets: 0,
                                resolvedTickets: 0,
                            });
                            setRecentTickets([]);
                        }
                        return;
                    }

                    const solicitacoesDetalhes = await Promise.all(
                        solicitacoesIds.map(async (id) => {
                            try {
                                const detail = await buscarSolicitacaoPorId(id);
                                return detail.data.solicitacao;
                            } catch {
                                return null;
                            }
                        })
                    );

                    const validSolicitacoes = solicitacoesDetalhes.filter(Boolean) as Solicitacao[];

                    tickets = (
                        await Promise.all(
                            validSolicitacoes.map((solicitacao) =>
                                montarTicket(solicitacao, ultimaMovPorSolicitacao.get(solicitacao.id_solicitacao))
                            )
                        )
                    ).filter(Boolean);
                } else {
                    const solicitacoesResp = await listarSolicitacoes({ usuarioId: String(userId) });
                    const solicitacoes = solicitacoesResp.data?.solicitacoes ?? [];

                    tickets = (
                        await Promise.all(
                            solicitacoes.map(async (solicitacao) => {
                                const movResp = await listarMovimentacoes({
                                    solicitacaoId: String(solicitacao.id_solicitacao),
                                });
                                const movimentacoes = movResp.data.movimentacoes;
                                const ultimaMov = movimentacoes.sort(
                                    (a, b) =>
                                        new Date(b.data_atualizacao).getTime() - new Date(a.data_atualizacao).getTime()
                                )[0];

                                return montarTicket(solicitacao, ultimaMov ?? null);
                            })
                        )
                    ).filter(Boolean);
                }

                const statsData = calcularStats(tickets);
                const recentTicketsData = [...tickets].sort((a, b) => b.updatedAtValue - a.updatedAtValue).slice(0, 5);

                if (!isCancelled) {
                    setStats(statsData);
                    setRecentTickets(recentTicketsData);
                }
            } catch (error) {
                console.error("Erro ao carregar dados do dashboard:", error);
                if (!isCancelled) {
                    setStats(undefined);
                    setRecentTickets([]);
                }
            }
        };

        loadDashboard();

        return () => {
            isCancelled = true;
        };
    }, [userId, username, isAdmin]);

    return {
        stats,
        recentTickets,
    };
}
