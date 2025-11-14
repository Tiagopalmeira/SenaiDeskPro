'use client';

import { useEffect } from 'react';
import {
  SolicitacaoCompleta,
} from '@/hooks/useSolicitacoes';
import { useTicketDetail } from '@/hooks/useTicketDetail';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  DetailSection,
  DetailLabel,
  DetailValue,
  StatusBadge,
  PriorityBadge,
  FormGroup,
  Label,
  Select,
  TextArea,
  ButtonGroup,
  Button,
  LoadingSpinner,
  ErrorMessage,
  SuccessMessage,
} from './TicketDetailModalStyles';

interface TicketDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  solicitacao: SolicitacaoCompleta | null;
  userId: number;
  isAdmin: boolean;
  onUpdate: () => void;
}

export function TicketDetailModal({
  isOpen,
  onClose,
  solicitacao,
  userId,
  isAdmin,
  onUpdate,
}: TicketDetailModalProps) {
  const {
    status,
    setStatus,
    resposta,
    setResposta,
    loading,
    error,
    success,
    handleAssinar,
    handleSalvar,
  } = useTicketDetail(solicitacao, userId);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        onUpdate();
        onClose();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [success, onUpdate, onClose]);

  if (!isOpen || !solicitacao) {
    return null;
  }

  const handleAssinarClick = async () => {
    const result = await handleAssinar();
    if (result) {
      // Success será tratado pelo useEffect
    }
  };

  const handleSalvarClick = async () => {
    const result = await handleSalvar();
    if (result) {
      // Success será tratado pelo useEffect
    }
  };

  const podeAssinar = isAdmin && solicitacao.status === 0 && !solicitacao.id_responsavel;
  const podeEditar = isAdmin && (solicitacao.id_responsavel === userId || podeAssinar);

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Solicitação #{solicitacao.id_solicitacao}</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        {loading && (
          <LoadingSpinner>
            <div>Carregando...</div>
          </LoadingSpinner>
        )}

        {error && (
          <ErrorMessage>
            {error}
          </ErrorMessage>
        )}

        {success && (
          <SuccessMessage>
            Alterações salvas com sucesso!
          </SuccessMessage>
        )}

        <DetailSection>
          <DetailLabel>Status</DetailLabel>
          <DetailValue>
            <StatusBadge $status={solicitacao.status}>
              {solicitacao.statusLabel}
            </StatusBadge>
          </DetailValue>
        </DetailSection>

        <DetailSection>
          <DetailLabel>Descrição</DetailLabel>
          <DetailValue>{solicitacao.descricao}</DetailValue>
        </DetailSection>

        <DetailSection>
          <DetailLabel>Prioridade</DetailLabel>
          <DetailValue>
            <PriorityBadge $priority={solicitacao.prioridade}>
              {solicitacao.prioridadeLabel}
            </PriorityBadge>
          </DetailValue>
        </DetailSection>

        <DetailSection>
          <DetailLabel>Data de Abertura</DetailLabel>
          <DetailValue>{solicitacao.dataAberturaFormatada}</DetailValue>
        </DetailSection>

        <DetailSection>
          <DetailLabel>Última Atualização</DetailLabel>
          <DetailValue>
            {solicitacao.dataUltimaAtualizacaoFormatada || 'Não modificado'}
          </DetailValue>
        </DetailSection>

        <DetailSection>
          <DetailLabel>Responsável</DetailLabel>
          <DetailValue>
            {solicitacao.nome_responsavel || 'Aguardando responsável'}
          </DetailValue>
        </DetailSection>

        {solicitacao.resposta && (
          <DetailSection>
            <DetailLabel>Resposta do Setor</DetailLabel>
            <DetailValue>{solicitacao.resposta}</DetailValue>
          </DetailSection>
        )}

        {podeEditar && (
          <>
            <FormGroup>
              <Label>Alterar Status</Label>
              <Select
                value={status}
                onChange={(e) => setStatus(Number(e.target.value) as 0 | 1 | 2)}
              >
                <option value={0}>Aberta</option>
                <option value={1}>Em Andamento</option>
                <option value={2}>Concluída</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Responder / Adicionar Andamento</Label>
              <TextArea
                value={resposta}
                onChange={(e) => setResposta(e.target.value)}
                placeholder="Digite sua resposta ou atualização sobre o andamento..."
              />
            </FormGroup>

            <ButtonGroup>
              {podeAssinar && (
                <Button $variant="secondary" onClick={handleAssinarClick} disabled={loading}>
                  Assinar Chamado
                </Button>
              )}
              <Button $variant="primary" onClick={handleSalvarClick} disabled={loading}>
                Salvar Alterações
              </Button>
            </ButtonGroup>
          </>
        )}

        {!isAdmin && (
          <DetailSection>
            <DetailLabel>Informações</DetailLabel>
            <DetailValue>
              Você pode visualizar os detalhes da sua solicitação. O setor responsável entrará em contato em breve.
            </DetailValue>
          </DetailSection>
        )}
      </ModalContent>
    </ModalOverlay>
  );
}

