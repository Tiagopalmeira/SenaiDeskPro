/**
 * Interfaces para Solicitações
 */

export interface Solicitacao {
    id_solicitacao: number;
    descricao: string;
    prioridade: number; // 0 = baixa, 1 = média, 2 = alta
    data_abertura: string;
    id_usuario: number;
    id_local: number;
    id_tipo_solicitacao: number;
    id_curso: number | null;
}

export interface SolicitacaoResponse {
    data: {
        solicitacoes: Solicitacao[];
    };
}

export interface SolicitacaoDetailResponse {
    data: {
        solicitacao: Solicitacao;
    };
}

export interface SolicitacaoFilters {
    usuarioId?: string;
    solicitacaoId?: string;
    area?: string;
    categoriaId?: string;
    localId?: string;
    cursoId?: string;
    curso?: string;
    prioridade?: string;
    status?: "0" | "1" | "2"; // 0 = aberto, 1 = em andamento, 2 = concluída
    dataInicio?: string; // ISO date-time
    dataFim?: string; // ISO date-time
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

    const headers = new Headers(options.headers || {});
    headers.set("Content-Type", "application/json");

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
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
 * Lista solicitações com filtros opcionais
 */
export async function listarSolicitacoes(filters?: SolicitacaoFilters): Promise<SolicitacaoResponse> {
    const params = new URLSearchParams();

    if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                params.append(key, String(value));
            }
        });
    }

    const queryString = params.toString();
    const endpoint = `/solicitacao/${queryString ? `?${queryString}` : ""}`;

    const response = await authenticatedFetch(endpoint);
    return await response.json();
}

/**
 * Busca uma solicitação por ID
 */
export async function buscarSolicitacaoPorId(id: number): Promise<SolicitacaoDetailResponse> {
    const response = await authenticatedFetch(`/solicitacao/${id}`);
    return await response.json();
}

/**
 * Cria uma nova solicitação
 */
export async function criarSolicitacao(data: {
    usuarioId: number;
    localId: number;
    tipoSolicitacaoId: number;
    cursoId?: number | null;
    descricao: string;
    prioridade: 0 | 1 | 2;
    imagemBase64?: string | null;
}): Promise<SolicitacaoDetailResponse> {
    const response = await authenticatedFetch("/solicitacao", {
        method: "POST",
        body: JSON.stringify(data),
    });
    return await response.json();
}
