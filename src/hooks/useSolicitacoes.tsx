import { useState, useEffect, useCallback } from "react";
import { listarSolicitacoes, SolicitacaoFilters } from "@/api_requests/solicitacoes";
import { listarMovimentacoes } from "@/api_requests/movimentacoes";
import { buscarUsuarioPorId } from "@/api_requests/usuarios";
import { formatDateBR, formatDateTimeBR } from "@/utils/dateHelpers";

/**
 * Interface para uma solicitação completa com dados enriquecidos
 */
export interface SolicitacaoCompleta {
    id_solicitacao: number;
    descricao: string;
    prioridade: number;
    data_abertura: string;
    id_usuario: number;
    id_local: number;
    id_tipo_solicitacao: number;
    id_curso: number | null;
    // Dados enriquecidos
    status: number; // 0 = aberto, 1 = em andamento, 2 = concluída
    data_ultima_atualizacao: string | null;
    id_responsavel: number | null; // ID do admin atribuído
    nome_responsavel: string | null;
    resposta: string | null;
    // Formatações
    prioridadeLabel: string;
    statusLabel: string;
    dataAberturaFormatada: string;
    dataUltimaAtualizacaoFormatada: string | null;
}

/**
 * Interface para filtros avançados
 */
export interface FiltrosAvancados {
    area?: string;
    categoriaId?: string;
    localId?: string;
    cursoId?: string;
    prioridade?: string;
    status?: "0" | "1" | "2" | "todos";
    dataInicio?: string;
    dataFim?: string;
    searchTerm?: string; // Busca por descrição
}

/**
 * Props do hook
 */
interface UseSolicitacoesProps {
    userId: number;
    isAdmin: boolean;
}

/**
 * Hook para gerenciar solicitações com toda a lógica de carregamento e filtros
 */
export function useSolicitacoes({ userId, isAdmin }: UseSolicitacoesProps) {
    const [solicitacoes, setSolicitacoes] = useState<SolicitacaoCompleta[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filtros, setFiltros] = useState<FiltrosAvancados>({});

    /**
     * Carrega as solicitações baseado no tipo de usuário
     */
    const carregarSolicitacoes = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const filters: SolicitacaoFilters = {};

            // Aplica filtros básicos
            if (!isAdmin) {
                // Usuário comum: apenas suas solicitações
                filters.usuarioId = String(userId);
            }

            if (filtros.status && filtros.status !== "todos") {
                filters.status = filtros.status;
            } else if (isAdmin) {
                filters.status = "0";
            }

            if (filtros.area) {
                filters.area = filtros.area;
            }
            if (filtros.localId) {
                filters.localId = filtros.localId;
            }
            if (filtros.cursoId) {
                filters.cursoId = filtros.cursoId;
            }
            if (filtros.categoriaId) {
                filters.categoriaId = filtros.categoriaId;
            }
            if (filtros.prioridade) {
                filters.prioridade = filtros.prioridade;
            }
            if (filtros.dataInicio) {
                filters.dataInicio = filtros.dataInicio;
            }
            if (filtros.dataFim) {
                filters.dataFim = filtros.dataFim;
            }

            // Busca solicitações
            const response = await listarSolicitacoes(filters);
            if (!response.data || !response.data.solicitacoes) {
                setSolicitacoes([]);
                throw new Error("Nenhuma solicitação encontrada.");
            }
            const solicitacoesData = response.data.solicitacoes;

            // Enriquece com dados de movimentações
            const solicitacoesCompletas = await Promise.all(
                solicitacoesData.map(async (sol) => {
                    // Busca movimentações da solicitação
                    const movsResponse = await listarMovimentacoes({
                        solicitacaoId: String(sol.id_solicitacao),
                    });
                    const movimentacoes = movsResponse.data.movimentacoes;

                    // Ordena por data (mais recente primeiro)
                    const movimentacoesOrdenadas = movimentacoes.sort(
                        (a, b) => new Date(b.data_atualizacao).getTime() - new Date(a.data_atualizacao).getTime()
                    );

                    const ultimaMovimentacao = movimentacoesOrdenadas[0];

                    // Busca nome do responsável se houver
                    let nomeResponsavel: string | null = null;
                    if (ultimaMovimentacao && ultimaMovimentacao.id_usuario) {
                        try {
                            const usuarioResponse = await buscarUsuarioPorId(ultimaMovimentacao.id_usuario);
                            nomeResponsavel = usuarioResponse.data.usuario.nome;
                        } catch {
                            nomeResponsavel = null;
                        }
                    }

                    const status = ultimaMovimentacao ? ultimaMovimentacao.status : 0; // 0 = aberto se não houver movimentação

                    const statusLabels: Record<number, string> = {
                        0: "Aberto",
                        1: "Em Andamento",
                        2: "Concluída",
                    };

                    const prioridadeLabels: Record<number, string> = {
                        0: "Baixa",
                        1: "Média",
                        2: "Alta",
                    };

                    return {
                        ...sol,
                        status,
                        data_ultima_atualizacao: ultimaMovimentacao
                            ? ultimaMovimentacao.data_atualizacao
                            : sol.data_abertura,
                        id_responsavel: ultimaMovimentacao ? ultimaMovimentacao.id_usuario : null,
                        nome_responsavel: nomeResponsavel,
                        resposta: ultimaMovimentacao?.resposta || null,
                        statusLabel: statusLabels[status],
                        prioridadeLabel: prioridadeLabels[sol.prioridade],
                        dataAberturaFormatada: formatDateBR(sol.data_abertura),
                        dataUltimaAtualizacaoFormatada: ultimaMovimentacao
                            ? formatDateTimeBR(ultimaMovimentacao.data_atualizacao)
                            : formatDateBR(sol.data_abertura),
                    } as SolicitacaoCompleta;
                })
            );

            // Aplica filtros adicionais no resultado final
            let solicitacoesFiltradas = solicitacoesCompletas;

            const statusFiltrado = Boolean(filtros.status && filtros.status !== "todos");
            if (isAdmin && !statusFiltrado) {
                solicitacoesFiltradas = solicitacoesFiltradas.filter((sol) => sol.status === 0);
            }

            if (filtros.searchTerm) {
                const termo = filtros.searchTerm.toLowerCase();
                solicitacoesFiltradas = solicitacoesFiltradas.filter(
                    (sol) => sol.descricao.toLowerCase().includes(termo) || `#${sol.id_solicitacao}`.includes(termo)
                );
            }

            setSolicitacoes(solicitacoesFiltradas);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Erro ao carregar solicitações";
            setError(message);
            setSolicitacoes([]);
        } finally {
            setLoading(false);
        }
    }, [userId, isAdmin, filtros]);

    // Carrega solicitações quando o hook é montado ou quando filtros mudam
    useEffect(() => {
        carregarSolicitacoes();
    }, [carregarSolicitacoes]);

    /**
     * Atualiza os filtros
     */
    const atualizarFiltros = useCallback((novosFiltros: Partial<FiltrosAvancados>) => {
        setFiltros((prev) => ({ ...prev, ...novosFiltros }));
    }, []);

    /**
     * Limpa todos os filtros
     */
    const limparFiltros = useCallback(() => {
        setFiltros({});
    }, []);

    /**
     * Recarrega as solicitações
     */
    const recarregar = useCallback(() => {
        carregarSolicitacoes();
    }, [carregarSolicitacoes]);

    return {
        solicitacoes,
        loading,
        error,
        filtros,
        atualizarFiltros,
        limparFiltros,
        recarregar,
    };
}
