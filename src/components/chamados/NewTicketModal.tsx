'use client';

import { useState } from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 32px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 28px;
  color: #9ca3af;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input<{ $hasError?: boolean }>`
  padding: 12px 16px;
  border: 1px solid ${props => props.$hasError ? '#ef4444' : '#d1d5db'};
  border-radius: 8px;
  font-size: 15px;
  font-family: inherit;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#dc2626' : '#2563eb'};
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const TextArea = styled.textarea<{ $hasError?: boolean }>`
  padding: 12px 16px;
  border: 1px solid ${props => props.$hasError ? '#ef4444' : '#d1d5db'};
  border-radius: 8px;
  font-size: 15px;
  font-family: inherit;
  min-height: 100px;
  resize: vertical;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#dc2626' : '#2563eb'};
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const Select = styled.select<{ $hasError?: boolean }>`
  padding: 12px 16px;
  border: 1px solid ${props => props.$hasError ? '#ef4444' : '#d1d5db'};
  border-radius: 8px;
  font-size: 15px;
  font-family: inherit;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#dc2626' : '#2563eb'};
  }

  &:disabled {
    background: #f3f4f6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background: #fee2e2;
  color: #991b1b;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 16px;
  border-left: 4px solid #ef4444;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 8px;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  ${(props) =>
    props.$variant === 'primary'
      ? `
    background: #2563eb;
    color: white;

    &:hover {
      background: #1d4ed8;
    }
  `
      : `
    background: #f3f4f6;
    color: #374151;

    &:hover {
      background: #e5e7eb;
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled.div`
  background: #10b981;
  color: white;
  padding: 16px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  font-weight: 500;
  animation: successSlide 0.4s ease;

  @keyframes successSlide {
    from {
      transform: translateY(-10px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  svg {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
  }
`;

const SuccessOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  z-index: 10;
  animation: scaleIn 0.3s ease;
  max-width: 400px;
  width: 90%;

  @keyframes scaleIn {
    from {
      transform: translate(-50%, -50%) scale(0.9);
      opacity: 0;
    }
    to {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
  }
`;

const SuccessContent = styled.div`
  text-align: center;
  padding: 40px 32px;
`;

const SuccessIcon = styled.div`
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;

  svg {
    width: 36px;
    height: 36px;
    color: white;
  }
`;

const SuccessTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
`;

const SuccessDescription = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 24px 0;
`;

const SuccessButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

interface NewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ticketData: TicketFormData) => void;
  userName: string;
  userMatricula: string;
  userCargo: string;
}

export interface TicketFormData {
  solicitante: string;
  matricula: string;
  cargo: string;
  local: string;
  subLocal: string;
  descricao: string;
  categoria: string;
  prioridade: string;
  imagem?: File | null;
  dataAbertura: string;
  horaAbertura: string;
}

// Mock de dados da API
const mockLocations = [
  { id: 'laboratorio', label: 'Laboratório' },
  { id: 'sala', label: 'Sala' },
  { id: 'setor', label: 'Setor' },
];

const mockSubLocations = [
  { id: 'lab-1', label: 'Laboratório 1', location: 'laboratorio' },
  { id: 'lab-2', label: 'Laboratório 2', location: 'laboratorio' },
  { id: 'lab-3', label: 'Laboratório 3', location: 'laboratorio' },
  { id: 'sala-1', label: 'Sala 1', location: 'sala' },
  { id: 'sala-2', label: 'Sala 2', location: 'sala' },
  { id: 'sala-3', label: 'Sala 3', location: 'sala' },
  { id: 'sala-4', label: 'Sala 4', location: 'sala' },
  { id: 'setor-adm', label: 'Administrativo', location: 'setor' },
  { id: 'setor-ti', label: 'TI', location: 'setor' },
  { id: 'setor-rh', label: 'RH', location: 'setor' },
];

const mockCategorias = [
  { id: 'ti', label: 'TI' },
  { id: 'manutencao', label: 'Manutenção' },
  { id: 'estrutural', label: 'Estrutural' },
  { id: 'limpeza', label: 'Limpeza' },
  { id: 'seguranca', label: 'Segurança' },
  { id: 'outros', label: 'Outros' },
];

export function NewTicketModal({ isOpen, onClose, onSubmit, userName, userMatricula, userCargo }: NewTicketModalProps) {
  // Obtém data e hora atuais no formato correto
  const now = new Date();
  const currentDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM

  const [formData, setFormData] = useState<TicketFormData>({
    solicitante: userName,
    matricula: userMatricula,
    cargo: userCargo,
    local: '',
    subLocal: '',
    descricao: '',
    categoria: '',
    prioridade: '',
    imagem: null,
    dataAbertura: currentDate,
    horaAbertura: currentTime,
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const availableSubLocations = formData.local
    ? mockSubLocations.filter((loc) => loc.location === formData.local)
    : [];

  const handleChange = (field: keyof TicketFormData, value: string) => {
    setFormData((prev) => {
      // Se mudou o local, limpa o sublocal
      if (field === 'local') {
        return { ...prev, [field]: value, subLocal: '' };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, imagem: file }));
      
      // Gerar preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, imagem: null }));
    setImagePreview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação dos campos
    const newErrors: Record<string, boolean> = {};

    if (!formData.descricao.trim()) newErrors.descricao = true;
    if (!formData.local) newErrors.local = true;
    if (!formData.subLocal) newErrors.subLocal = true;
    if (!formData.categoria) newErrors.categoria = true;
    if (!formData.prioridade) newErrors.prioridade = true;

    // Se houver erros, define o estado e para a submissão
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Limpa erros e submete
    setErrors({});
    onSubmit(formData);

    // Mostra mensagem de sucesso
    setShowSuccess(true);

    // Limpa o formulário mas mantém data e hora atuais
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0, 5);

    setFormData({
      solicitante: userName,
      matricula: userMatricula,
      cargo: userCargo,
      local: '',
      subLocal: '',
      descricao: '',
      categoria: '',
      prioridade: '',
      imagem: null,
      dataAbertura: currentDate,
      horaAbertura: currentTime,
    });
    setImagePreview(null);
  };

  const handleClose = () => {
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0, 5);

    setFormData({
      solicitante: userName,
      matricula: userMatricula,
      cargo: userCargo,
      local: '',
      subLocal: '',
      descricao: '',
      categoria: '',
      prioridade: '',
      imagem: null,
      dataAbertura: currentDate,
      horaAbertura: currentTime,
    });
    setErrors({});
    setShowSuccess(false);
    setImagePreview(null);
    onClose();
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
              onChange={handleImageChange}
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
