import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useDashboard } from '@/hooks/useDashboard';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

/**
 * Hook customizado para gerenciar o estado e lógica da página Home/Dashboard
 *
 * @description
 * Este hook centraliza toda a lógica de negócio da página Home, incluindo:
 * - Autenticação do usuário e gerenciamento de sessão
 * - Tema (dark/light mode)
 * - Estado da sidebar (colapsada/expandida)
 * - Dados do dashboard (estatísticas e tickets recentes)
 * - Funções utilitárias (logout, toggle sidebar, obter iniciais)
 *
 * @example
 * ```tsx
 * function HomePage() {
 *   const {
 *     user,
 *     isDarkMode,
 *     toggleTheme,
 *     isCollapsed,
 *     toggleSidebar,
 *     getInitials,
 *     handleLogout,
 *     stats,
 *     recentTickets
 *   } = useHomePage();
 *
 *   if (!user) return <Redirect to="/login" />;
 *
 *   return (
 *     <div>
 *       <button onClick={toggleSidebar}>Toggle Sidebar</button>
 *       <p>Total: {stats.totalTickets}</p>
 *     </div>
 *   );
 * }
 * ```
 *
 * @returns {Object} Objeto contendo:
 * @returns {Object | null} user - Usuário autenticado ou null com propriedades { username: string, isAdmin: boolean }
 * @returns {boolean} isDarkMode - Estado do tema (true = dark, false = light)
 * @returns {() => void} toggleTheme - Função para alternar o tema
 * @returns {boolean} isCollapsed - Estado da sidebar (true = colapsada)
 * @returns {() => void} toggleSidebar - Função para alternar estado da sidebar
 * @returns {(username: string) => string} getInitials - Função para extrair iniciais do nome
 * @returns {() => void} handleLogout - Função para deslogar e redirecionar
 * @returns {DashboardStats | undefined} stats - Estatísticas do dashboard (total, abertos, em andamento, resolvidos)
 * @returns {Ticket[]} recentTickets - Lista dos 5 tickets mais recentes do usuário
 */
export function useHomePage() {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const router = useRouter();
  // Estado local para controlar se a sidebar está colapsada ou não
  const [isCollapsed, setIsCollapsed] = useState(false);

  /**
   * Extrai as iniciais de um nome de usuário
   * Se o nome tem múltiplas palavras, retorna primeira letra + última letra
   * Se tem apenas uma palavra, retorna as 2 primeiras letras
   *
   * @param {string} username - Nome completo do usuário
   * @returns {string} Iniciais em maiúsculas (ex: "João Silva" -> "JS")
   */
  const getInitials = (username: string) => {
    const parts = username.split(' ');
    if (parts.length === 1) {
      return username.charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  /**
   * Realiza o logout do usuário e redireciona para a página de login
   * - Chama a função logout do AuthContext
   * - Redireciona para a rota raiz '/'
   */
  const handleLogout = () => {
    logout();
    router.push('/');
  };

  /**
   * Alterna o estado da sidebar entre colapsada e expandida
   */
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Obtém os dados do dashboard apenas se o usuário estiver autenticado
  // Filtra tickets e calcula estatísticas com base no perfil (admin/user)
  const dashboardData = user ? useDashboard({
    username: user.username,
    isAdmin: user.isAdmin,
  }) : null;

  return {
    user,
    isDarkMode,
    toggleTheme,
    isCollapsed,
    toggleSidebar,
    getInitials,
    handleLogout,
    stats: dashboardData?.stats,
    recentTickets: dashboardData?.recentTickets || [],
  };
}
