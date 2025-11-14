/**
 * Dados mockados para o formulário de novo chamado
 * TODO: Substituir por dados reais da API quando disponível
 */

export interface MockLocation {
  id: string;
  label: string;
}

export interface MockSubLocation {
  id: string;
  label: string;
  location: string;
}

export interface MockCategoria {
  id: string;
  label: string;
}

export const mockLocations: MockLocation[] = [
  { id: 'laboratorio', label: 'Laboratório' },
  { id: 'sala', label: 'Sala' },
  { id: 'setor', label: 'Setor' },
];

export const mockSubLocations: MockSubLocation[] = [
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

export const mockCategorias: MockCategoria[] = [
  { id: 'ti', label: 'TI' },
  { id: 'manutencao', label: 'Manutenção' },
  { id: 'estrutural', label: 'Estrutural' },
  { id: 'limpeza', label: 'Limpeza' },
  { id: 'seguranca', label: 'Segurança' },
  { id: 'outros', label: 'Outros' },
];

