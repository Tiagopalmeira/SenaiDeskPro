export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'aberto' | 'em_andamento' | 'resolvido' | 'fechado';
  priority: 'alta' | 'média' | 'baixa';
  assignee: string;
  createdBy: string;
  created: string;
  lastUpdate: string;
  category: string;
}

export const mockTickets: Ticket[] = [
  {
    id: '#12345',
    title: 'Problema no sistema de login',
    description: 'Usuários relatam lentidão ao fazer login no sistema. O tempo de resposta está acima de 10 segundos.',
    status: 'aberto',
    priority: 'alta',
    assignee: 'admin',
    createdBy: 'user',
    created: '14/11/2025',
    lastUpdate: '14/11/2025',
    category: 'Sistema'
  },
  {
    id: '#12344',
    title: 'Atualização de cadastro não salva',
    description: 'Ao tentar atualizar dados cadastrais, as informações não são salvas no banco de dados.',
    status: 'em_andamento',
    priority: 'alta',
    assignee: 'Maria Santos',
    createdBy: 'Ana Costa',
    created: '13/11/2025',
    lastUpdate: '14/11/2025',
    category: 'Banco de Dados'
  },
  {
    id: '#12343',
    title: 'Erro ao gerar relatório mensal',
    description: 'Sistema retorna erro 500 ao tentar gerar o relatório de vendas do mês.',
    status: 'em_andamento',
    priority: 'média',
    assignee: 'Pedro Oliveira',
    createdBy: 'Tiago Palmeira',
    created: '13/11/2025',
    lastUpdate: '13/11/2025',
    category: 'Relatórios'
  },
  {
    id: '#12342',
    title: 'Interface não responsiva em mobile',
    description: 'O layout da página de produtos não se adapta corretamente em dispositivos móveis.',
    status: 'aberto',
    priority: 'média',
    assignee: 'Ana Costa',
    createdBy: 'Carlos Lima',
    created: '12/11/2025',
    lastUpdate: '12/11/2025',
    category: 'Interface'
  },
  {
    id: '#12341',
    title: 'Adicionar filtro de data',
    description: 'Solicitação para adicionar filtro de período nas consultas de pedidos.',
    status: 'resolvido',
    priority: 'baixa',
    assignee: 'Carlos Lima',
    createdBy: 'Tiago Palmeira',
    created: '11/11/2025',
    lastUpdate: '13/11/2025',
    category: 'Feature'
  },
  {
    id: '#12340',
    title: 'Otimizar carregamento de imagens',
    description: 'As imagens do catálogo estão demorando muito para carregar.',
    status: 'fechado',
    priority: 'baixa',
    assignee: 'Juliana Rocha',
    createdBy: 'Ana Costa',
    created: '10/11/2025',
    lastUpdate: '12/11/2025',
    category: 'Performance'
  }
];

export const statusLabels: Record<string, string> = {
  aberto: 'Aberto',
  em_andamento: 'Em Andamento',
  resolvido: 'Resolvido',
  fechado: 'Fechado'
};
