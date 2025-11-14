import { useState, useEffect } from 'react';
import { SolicitacaoCompleta } from './useSolicitacoes';
import { criarOuAtualizarMovimentacao } from '@/api_requests/movimentacoes';

export function useTicketDetail(
  solicitacao: SolicitacaoCompleta | null,
  userId: number
) {
  const [status, setStatus] = useState<0 | 1 | 2>(0);
  const [resposta, setResposta] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (solicitacao) {
      setStatus(solicitacao.status as 0 | 1 | 2);
      setResposta(solicitacao.resposta || '');
      setError(null);
      setSuccess(false);
    }
  }, [solicitacao]);

  const handleAssinar = async () => {
    if (!solicitacao) return;

    setLoading(true);
    setError(null);

    try {
      await criarOuAtualizarMovimentacao({
        solicitacaoId: solicitacao.id_solicitacao,
        usuarioId: userId,
        status: 0,
        resposta: null,
      });

      setSuccess(true);
      return true;
    } catch (err: any) {
      setError(err.message || 'Erro ao assinar chamado');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSalvar = async () => {
    if (!solicitacao) return;

    setLoading(true);
    setError(null);

    try {
      await criarOuAtualizarMovimentacao({
        solicitacaoId: solicitacao.id_solicitacao,
        usuarioId: userId,
        status,
        resposta: resposta || null,
      });

      setSuccess(true);
      return true;
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar alterações');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    status,
    setStatus,
    resposta,
    setResposta,
    loading,
    error,
    success,
    handleAssinar,
    handleSalvar,
  };
}

