/**
 * Interfaces para Movimentações
 */

export interface Movimentacao {
    id_movimentacao: number;
    id_usuario: number;
    id_solicitacao: number;
    status: number; // 0 = aberto, 1 = em andamento, 2 = concluída
    data_atualizacao: string;
    resposta?: string | null;
}

export interface MovimentacaoResponse {
    data: {
        movimentacoes: Movimentacao[];
    };
}

export interface MovimentacaoDetailResponse {
    data: {
        movimentacao: Movimentacao;
    };
}

export interface MovimentacaoFilters {
    usuarioId?: string;
    solicitacaoId?: string;
    status?: "0" | "1" | "2";
}

/**
 * Obtém a URL base da API
 */
function getApiUrl(): string {
    return process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
}

/**
 * Obtém o token de autenticação do localStorage
 */
function getAuthToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("authToken");
}

/**
 * Realiza requisição autenticada
 */
async function authenticatedFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const token = getAuthToken();
    const apiUrl = getApiUrl();

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
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
 * Lista movimentações com filtros opcionais
 */
export async function listarMovimentacoes(filters?: MovimentacaoFilters): Promise<MovimentacaoResponse> {
    const params = new URLSearchParams();

    if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                params.append(key, String(value));
            }
        });
    }

    const queryString = params.toString();
    const endpoint = `/movimentacao/${queryString ? `?${queryString}` : ""}`;

    const response = await authenticatedFetch(endpoint);
    return await response.json();
}

/**
 * Cria ou atualiza uma movimentação
 */
export async function criarOuAtualizarMovimentacao(data: {
    movimentacaoId?: number;
    solicitacaoId: number;
    usuarioId: number;
    status?: 0 | 1 | 2;
    resposta?: string | null;
}): Promise<MovimentacaoDetailResponse> {
    const response = await authenticatedFetch("/movimentacao/", {
        method: "POST",
        body: JSON.stringify(data),
    });
    return await response.json();
}
