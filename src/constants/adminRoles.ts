/**
 * Lista de cargos que possuem privilégios de administrador
 *
 * Adicione aqui os cargos que devem ter acesso administrativo ao sistema
 */
export const ADMIN_ROLES = [
  'TI',
  // Adicione mais cargos aqui conforme necessário
  // Exemplo:
  // 'GERENTE',
  // 'DIRETOR',
  // 'COORDENADOR',
];

/**
 * Verifica se um cargo possui privilégios de administrador
 *
 * @param cargo - Cargo do usuário retornado pela API
 * @returns true se o cargo estiver na lista de administradores
 */
export function isAdminRole(cargo: string): boolean {
  return ADMIN_ROLES.includes(cargo.toUpperCase());
}
