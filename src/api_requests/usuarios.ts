import { Usuario } from './login';

export interface UsuarioResponse {
  data: {
    usuario: Usuario;
  };
}

/**
 * Obtém a URL base da API
 */
function getApiUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
}

/**
 * Obtém o token de autenticação do localStorage
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
}

/**
 * Realiza requisição autenticada
 */
async function authenticatedFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getAuthToken();
  const apiUrl = getApiUrl();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${apiUrl}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Erro na requisição: ${response.status}`);
  }

  return response;
}

/**
 * Busca um usuário por ID
 */
export async function buscarUsuarioPorId(id: number): Promise<UsuarioResponse> {
  const response = await authenticatedFetch(`/usuario/${id}`);
  return await response.json();
}

