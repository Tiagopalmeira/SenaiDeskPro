import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  listarSolicitacoes,
  Solicitacao,
  SolicitacaoFilters,
} from '@/api_requests/solicitacoes';
import {
  listarMovimentacoes,
  Movimentacao,
} from '@/api_requests/movimentacoes';
import { buscarUsuarioPorId } from '@/api_requests/usuarios';
import { formatDateBR, formatDateTimeBR } from '@/utils/dateHelpers';

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
  status?: '0' | '1' | '2' | 'todos';
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

      if (filtros.status && filtros.status !== 'todos') {
        filters.status = filtros.status;
      }
      if (filtros.localId) {
        filters.localId = filtros.localId;
      }
      if (filtros.cursoId) {
        filters.cursoId = filtros.cursoId;
      }
      if (filtros.prioridade) {
        filters.prioridade = filtros.prioridade;
      }
      if (filtros.categoriaId) {
        filters.categoriaId = filtros.categoriaId;
      }
      if (filtros.dataInicio) {
        filters.dataInicio = filtros.dataInicio;
      }
      if (filtros.dataFim) {
        filters.dataFim = filtros.dataFim;
      }

      // Busca solicitações
      const response = await listarSolicitacoes(filters);
      let solicitacoesData = response.data.solicitacoes;

      // Se for admin, filtra: atribuídas a ele OU em aberto (sem responsável)
      if (isAdmin) {
        // Busca movimentações do admin para encontrar chamados atribuídos
        const movimentacoesAdmin = await listarMovimentacoes({ usuarioId: String(userId) });
        const idsAtribuidos = new Set(
          movimentacoesAdmin.data.movimentacoes.map((m) => m.id_solicitacao)
        );

        // Para cada solicitação, verifica se está atribuída ou em aberto
        const solicitacoesFiltradas: typeof solicitacoesData = [];
        
        for (const sol of solicitacoesData) {
          // Se já está atribuída ao admin, inclui
          if (idsAtribuidos.has(sol.id_solicitacao)) {
            solicitacoesFiltradas.push(sol);
            continue;
          }

          // Verifica se está em aberto (sem movimentação ou última movimentação com status 0)
          const movsResponse = await listarMovimentacoes({
            solicitacaoId: String(sol.id_solicitacao),
          });
          const movimentacoes = movsResponse.data.movimentacoes;

          if (movimentacoes.length === 0) {
            // Sem movimentação = em aberto (sem responsável)
            solicitacoesFiltradas.push(sol);
          } else {
            // Pega a última movimentação
            const ultimaMov = movimentacoes.sort(
              (a, b) =>
                new Date(b.data_atualizacao).getTime() -
                new Date(a.data_atualizacao).getTime()
            )[0];
            
            // Se status é 0 (aberto) e não está atribuída a outro admin (ou não tem responsável), inclui
            // Se está atribuída a outro admin (id_usuario diferente e não é o próprio admin), não inclui
            if (ultimaMov.status === 0) {
              // Está em aberto - verifica se não está atribuída a outro admin
              if (ultimaMov.id_usuario === userId || !ultimaMov.id_usuario) {
                // Está atribuída ao próprio admin ou não tem responsável
                solicitacoesFiltradas.push(sol);
              }
              // Se está atribuída a outro admin (ultimaMov.id_usuario !== userId), não inclui
            }
            // Se status não é 0, não está em aberto, então só inclui se estiver atribuída ao admin
          }
        }

        solicitacoesData = solicitacoesFiltradas;
      }

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
            (a, b) =>
              new Date(b.data_atualizacao).getTime() -
              new Date(a.data_atualizacao).getTime()
          );

          const ultimaMovimentacao = movimentacoesOrdenadas[0];

          // Busca nome do responsável se houver
          let nomeResponsavel: string | null = null;
          if (ultimaMovimentacao && ultimaMovimentacao.id_usuario) {
            try {
              const usuarioResponse = await buscarUsuarioPorId(
                ultimaMovimentacao.id_usuario
              );
              nomeResponsavel = usuarioResponse.data.usuario.nome;
            } catch {
              nomeResponsavel = null;
            }
          }

          const status = ultimaMovimentacao
            ? ultimaMovimentacao.status
            : 0; // 0 = aberto se não houver movimentação

          const statusLabels: Record<number, string> = {
            0: 'Aberto',
            1: 'Em Andamento',
            2: 'Concluída',
          };

          const prioridadeLabels: Record<number, string> = {
            0: 'Baixa',
            1: 'Média',
            2: 'Alta',
          };

          return {
            ...sol,
            status,
            data_ultima_atualizacao: ultimaMovimentacao
              ? ultimaMovimentacao.data_atualizacao
              : sol.data_abertura,
            id_responsavel: ultimaMovimentacao
              ? ultimaMovimentacao.id_usuario
              : null,
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

      // Aplica filtro de busca por texto se houver
      let solicitacoesFiltradas = solicitacoesCompletas;
      if (filtros.searchTerm) {
        const termo = filtros.searchTerm.toLowerCase();
        solicitacoesFiltradas = solicitacoesCompletas.filter(
          (sol) =>
            sol.descricao.toLowerCase().includes(termo) ||
            `#${sol.id_solicitacao}`.includes(termo)
        );
      }

      setSolicitacoes(solicitacoesFiltradas);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar solicitações');
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

