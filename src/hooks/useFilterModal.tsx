import { useState, useEffect } from 'react';
import {
  listarLocais,
  listarCursos,
  listarTiposSolicitacao,
} from '@/api_requests/recursos';

export interface Local {
  id_local: number;
  nome: string;
}

export interface Curso {
  id_curso: number;
  nome: string;
}

export interface TipoSolicitacao {
  id_tipo_solicitacao: number;
  nome: string;
}

export function useFilterModal(isOpen: boolean) {
  const [locais, setLocais] = useState<Local[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [tiposSolicitacao, setTiposSolicitacao] = useState<TipoSolicitacao[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      carregarRecursos();
    }
  }, [isOpen]);

  const carregarRecursos = async () => {
    setLoading(true);
    try {
      const [locaisRes, cursosRes, tiposRes] = await Promise.all([
        listarLocais(),
        listarCursos(),
        listarTiposSolicitacao(),
      ]);

      setLocais(locaisRes.data.locais);
      setCursos(cursosRes.data.cursos);
      setTiposSolicitacao(tiposRes.data.tipoSolicitacao);
    } catch (err) {
      console.error('Erro ao carregar recursos:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    locais,
    cursos,
    tiposSolicitacao,
    loading,
  };
}

