'use client';

import { useState } from 'react';
import { useNewTicketForm, TicketFormData } from '@/hooks/useNewTicketForm';
import { mockLocations, mockSubLocations, mockCategorias } from '@/utils/constants/ticketFormData';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  Form,
  FormGroup,
  Label,
  Input,
  TextArea,
  Select,
  ErrorMessage,
  FormRow,
  ButtonGroup,
  Button,
  SuccessOverlay,
  SuccessContent,
  SuccessIcon,
  SuccessTitle,
  SuccessDescription,
  SuccessButtons,
} from './NewTicketModalStyles';

interface NewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ticketData: TicketFormData) => void;
  userName: string;
  userMatricula: string;
  userCargo: string;
}

export type { TicketFormData };

export function NewTicketModal({ isOpen, onClose, onSubmit, userName, userMatricula, userCargo }: NewTicketModalProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  
  const {
    formData,
    errors,
    imagePreview,
    handleChange,
    handleImageChange,
    removeImage,
    validate,
    reset,
  } = useNewTicketForm(userName, userMatricula, userCargo);

  const availableSubLocations = formData.local
    ? mockSubLocations.filter((loc) => loc.location === formData.local)
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit(formData);
    setShowSuccess(true);
    reset();
  };

  const handleClose = () => {
    reset();
    setShowSuccess(false);
    onClose();
  };

  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageChange(e.target.files?.[0] || null);
  };

  const handleConfirmSuccess = () => {
    setShowSuccess(false);
    onClose();
  };

  const handleNewTicket = () => {
    setShowSuccess(false);
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Novo Chamado</ModalTitle>
          <CloseButton onClick={handleClose}>&times;</CloseButton>
        </ModalHeader>

        {showSuccess && (
          <SuccessOverlay>
            <SuccessContent>
              <SuccessIcon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </SuccessIcon>
              <SuccessTitle>Chamado Criado com Sucesso!</SuccessTitle>
              <SuccessDescription>
                O chamado foi registrado e o responsável será notificado.
              </SuccessDescription>
              <SuccessButtons>
                <Button $variant="secondary" type="button" onClick={handleNewTicket}>
                  Criar Outro Chamado
                </Button>
                <Button $variant="primary" type="button" onClick={handleConfirmSuccess}>
                  Confirmar
                </Button>
              </SuccessButtons>
            </SuccessContent>
          </SuccessOverlay>
        )}

        <Form onSubmit={handleSubmit}>
          {Object.keys(errors).length > 0 && (
            <ErrorMessage>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Por favor, preencha todos os campos obrigatórios.</span>
            </ErrorMessage>
          )}

          <FormRow>
            <FormGroup>
              <Label htmlFor="solicitante">Nome do Solicitante</Label>
              <Input
                id="solicitante"
                type="text"
                value={formData.solicitante}
                disabled
                style={{ backgroundColor: '#f9fafb', cursor: 'not-allowed' }}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="matricula">Matrícula</Label>
              <Input
                id="matricula"
                type="text"
                value={formData.matricula}
                disabled
                style={{ backgroundColor: '#f9fafb', cursor: 'not-allowed' }}
              />
            </FormGroup>
          </FormRow>

          <FormGroup>
            <Label htmlFor="cargo">Cargo</Label>
            <Input
              id="cargo"
              type="text"
              value={formData.cargo}
              disabled
              style={{ backgroundColor: '#f9fafb', cursor: 'not-allowed' }}
            />
          </FormGroup>

          <FormRow>
            <FormGroup>
              <Label htmlFor="local">Local do Problema *</Label>
              <Select
                id="local"
                value={formData.local}
                onChange={(e) => handleChange('local', e.target.value)}
                $hasError={errors.local}
              >
                <option value="">Selecione o local</option>
                {mockLocations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.label}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="subLocal">Especificar Local *</Label>
              <Select
                id="subLocal"
                value={formData.subLocal}
                onChange={(e) => handleChange('subLocal', e.target.value)}
                disabled={!formData.local}
                $hasError={errors.subLocal}
              >
                <option value="">
                  {formData.local ? 'Selecione' : 'Selecione o local primeiro'}
                </option>
                {availableSubLocations.map((subLocation) => (
                  <option key={subLocation.id} value={subLocation.id}>
                    {subLocation.label}
                  </option>
                ))}
              </Select>
            </FormGroup>
          </FormRow>

          <FormGroup>
            <Label htmlFor="descricao">Descrição Detalhada *</Label>
            <TextArea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => handleChange('descricao', e.target.value)}
              placeholder="Descreva o problema em detalhes"
              $hasError={errors.descricao}
            />
          </FormGroup>

          <FormRow>
            <FormGroup>
              <Label htmlFor="categoria">Categoria *</Label>
              <Select
                id="categoria"
                value={formData.categoria}
                onChange={(e) => handleChange('categoria', e.target.value)}
                $hasError={errors.categoria}
              >
                <option value="">Selecione a categoria</option>
                {mockCategorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.label}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="prioridade">Prioridade *</Label>
              <Select
                id="prioridade"
                value={formData.prioridade}
                onChange={(e) => handleChange('prioridade', e.target.value)}
                $hasError={errors.prioridade}
              >
                <option value="">Selecione a prioridade</option>
                <option value="urgente">Urgente</option>
                <option value="media">Média</option>
                <option value="baixa">Baixa</option>
              </Select>
            </FormGroup>
          </FormRow>

          <FormGroup>
            <Label htmlFor="imagem">Upload de Imagem (Opcional)</Label>
              <Input
                id="imagem"
                type="file"
                accept="image/*"
                onChange={handleImageInputChange}
              />
            {imagePreview && (
              <div style={{ marginTop: '12px', position: 'relative' }}>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  style={{ 
                    width: '100%', 
                    maxHeight: '200px', 
                    objectFit: 'cover', 
                    borderRadius: '8px' 
                  }} 
                />
                <button
                  type="button"
                  onClick={removeImage}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                  }}
                >
                  ×
                </button>
              </div>
            )}
          </FormGroup>

          <FormRow>
            <FormGroup>
              <Label htmlFor="dataAbertura">Data de Abertura</Label>
              <Input
                id="dataAbertura"
                type="date"
                value={formData.dataAbertura}
                disabled
                style={{ backgroundColor: '#f9fafb', cursor: 'not-allowed' }}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="horaAbertura">Hora de Abertura</Label>
              <Input
                id="horaAbertura"
                type="time"
                value={formData.horaAbertura}
                disabled
                style={{ backgroundColor: '#f9fafb', cursor: 'not-allowed' }}
              />
            </FormGroup>
          </FormRow>

          <ButtonGroup>
            <Button type="button" $variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" $variant="primary">
              Criar Chamado
            </Button>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
}
