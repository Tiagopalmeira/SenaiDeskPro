'use client';

import { useState, useEffect } from 'react';
import { FiltrosAvancados } from '@/hooks/useSolicitacoes';
import { useFilterModal } from '@/hooks/useFilterModal';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  FormGroup,
  Label,
  Select,
  Input,
  ButtonGroup,
  Button,
} from './FilterModalStyles';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filtros: FiltrosAvancados;
  onApply: (filtros: FiltrosAvancados) => void;
}

export function FilterModal({
  isOpen,
  onClose,
  filtros,
  onApply,
}: FilterModalProps) {
  const [localFiltros, setLocalFiltros] = useState<FiltrosAvancados>(filtros);
  const { locais, cursos, tiposSolicitacao, loading } = useFilterModal(isOpen);

  useEffect(() => {
    setLocalFiltros(filtros);
  }, [filtros]);

  const handleApply = () => {
    onApply(localFiltros);
    onClose();
  };

  const handleClear = () => {
    const filtrosLimpos: FiltrosAvancados = {};
    setLocalFiltros(filtrosLimpos);
    onApply(filtrosLimpos);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Filtros Avançados</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        {loading ? (
          <div>Carregando...</div>
        ) : (
          <>
            <FormGroup>
              <Label>Status</Label>
              <Select
                value={localFiltros.status || 'todos'}
                onChange={(e) =>
                  setLocalFiltros({
                    ...localFiltros,
                    status: e.target.value === 'todos' ? undefined : (e.target.value as '0' | '1' | '2'),
                  })
                }
              >
                <option value="todos">Todos</option>
                <option value="0">Aberta</option>
                <option value="1">Em Andamento</option>
                <option value="2">Concluída</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Área / Categoria</Label>
              <Select
                value={localFiltros.categoriaId || ''}
                onChange={(e) =>
                  setLocalFiltros({
                    ...localFiltros,
                    categoriaId: e.target.value || undefined,
                  })
                }
              >
                <option value="">Todas</option>
                {tiposSolicitacao.map((tipo) => (
                  <option key={tipo.id_tipo_solicitacao} value={String(tipo.id_tipo_solicitacao)}>
                    {tipo.nome}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Laboratório / Local</Label>
              <Select
                value={localFiltros.localId || ''}
                onChange={(e) =>
                  setLocalFiltros({
                    ...localFiltros,
                    localId: e.target.value || undefined,
                  })
                }
              >
                <option value="">Todos</option>
                {locais.map((local) => (
                  <option key={local.id_local} value={String(local.id_local)}>
                    {local.nome}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Curso</Label>
              <Select
                value={localFiltros.cursoId || ''}
                onChange={(e) =>
                  setLocalFiltros({
                    ...localFiltros,
                    cursoId: e.target.value || undefined,
                  })
                }
              >
                <option value="">Todos</option>
                {cursos.map((curso) => (
                  <option key={curso.id_curso} value={String(curso.id_curso)}>
                    {curso.nome}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Prioridade</Label>
              <Select
                value={localFiltros.prioridade || ''}
                onChange={(e) =>
                  setLocalFiltros({
                    ...localFiltros,
                    prioridade: e.target.value || undefined,
                  })
                }
              >
                <option value="">Todas</option>
                <option value="0">Baixa</option>
                <option value="1">Média</option>
                <option value="2">Alta</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Data Início</Label>
              <Input
                type="date"
                value={localFiltros.dataInicio?.split('T')[0] || ''}
                onChange={(e) => {
                  const date = e.target.value;
                  setLocalFiltros({
                    ...localFiltros,
                    dataInicio: date ? `${date}T00:00:00Z` : undefined,
                  });
                }}
              />
            </FormGroup>

            <FormGroup>
              <Label>Data Fim</Label>
              <Input
                type="date"
                value={localFiltros.dataFim?.split('T')[0] || ''}
                onChange={(e) => {
                  const date = e.target.value;
                  setLocalFiltros({
                    ...localFiltros,
                    dataFim: date ? `${date}T23:59:59Z` : undefined,
                  });
                }}
              />
            </FormGroup>

            <ButtonGroup>
              <Button $variant="secondary" onClick={handleClear}>
                Limpar
              </Button>
              <Button onClick={handleApply}>Aplicar</Button>
            </ButtonGroup>
          </>
        )}
      </ModalContent>
    </ModalOverlay>
  );
}

