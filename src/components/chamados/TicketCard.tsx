import React from 'react';
import {
  MetaLabel,
  MetaValue,
  PriorityIndicator,
  StatusBadge,
  TicketCardContainer,
  TicketDescription,
  TicketFooter,
  TicketHeader,
  TicketId,
  TicketMeta,
  TicketTitle
} from './ChamadosStyles';
import { SolicitacaoCompleta } from '@/hooks/useSolicitacoes';

interface TicketCardProps {
  solicitacao: SolicitacaoCompleta;
  onClick?: () => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({ solicitacao, onClick }) => {
  // Mapeia prioridade numérica para string
  const prioridadeMap: Record<number, 'alta' | 'média' | 'baixa'> = {
    0: 'baixa',
    1: 'média',
    2: 'alta',
  };

  // Mapeia status numérico para string
  const statusMap: Record<number, 'aberto' | 'em_andamento' | 'resolvido' | 'fechado'> = {
    0: 'aberto',
    1: 'em_andamento',
    2: 'resolvido',
  };

  return (
    <TicketCardContainer onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <TicketHeader>
        <TicketId>#{solicitacao.id_solicitacao}</TicketId>
        <StatusBadge $status={statusMap[solicitacao.status] || 'aberto'}>
          {solicitacao.statusLabel}
        </StatusBadge>
      </TicketHeader>

      <TicketTitle>{solicitacao.descricao.substring(0, 60)}{solicitacao.descricao.length > 60 ? '...' : ''}</TicketTitle>
      <TicketDescription>{solicitacao.descricao}</TicketDescription>

      <TicketFooter>
        <TicketMeta>
          <MetaLabel>Responsável</MetaLabel>
          <MetaValue>{solicitacao.nome_responsavel || 'Aguardando responsável'}</MetaValue>
        </TicketMeta>

        <TicketMeta>
          <MetaLabel>Abertura</MetaLabel>
          <MetaValue>{solicitacao.dataAberturaFormatada}</MetaValue>
        </TicketMeta>

        <TicketMeta>
          <MetaLabel>Última Att.</MetaLabel>
          <MetaValue>
            {solicitacao.dataUltimaAtualizacaoFormatada || 'Não modificado'}
          </MetaValue>
        </TicketMeta>

        <TicketMeta style={{ alignItems: 'flex-end' }}>
          <MetaLabel>Prioridade</MetaLabel>
          <PriorityIndicator $priority={prioridadeMap[solicitacao.prioridade] || 'baixa'} />
        </TicketMeta>
      </TicketFooter>
    </TicketCardContainer>
  );
};
