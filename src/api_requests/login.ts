/**
 * Interface para o payload de login
 */
export interface LoginPayload {
  usuario: string;
  senha: string;
}

/**
 * Interface para os dados do usuário retornados pela API
 */
export interface Usuario {
  id_usuario: number;
  matricula: string;
  email: string;
  cargo: string;
  nome: string;
  login: string;
  ativo: number;
  data_criacao: string;
  data_atualizacao: string | null;
}

/**
 * Interface para a resposta de login da API
 */
export interface LoginResponse {
  data: {
    token: string;
    usuario: Usuario;
  };
}

/**
 * Realiza requisição de login
 *
 * @param usuario - Login de rede do usuário
 * @param senha - Senha do usuário
 * @returns Promise com a resposta do login
 */
export async function loginRequest(
  usuario: string,
  senha: string
): Promise<LoginResponse> {
  const response = await fetch('http://localhost:3000/usuario/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      usuario,
      senha,
    }),
  });

  if (!response.ok) {
    throw new Error(`Erro no login: ${response.status}`);
  }

  return await response.json();
}
