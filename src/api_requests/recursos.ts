/**
 * Interfaces para Recursos Auxiliares
 */

export interface Local {
    id_local: number;
    nome: string;
    ativo: number;
}

export interface Curso {
    id_curso: number;
    nome: string;
    ativo: number;
}

export interface TipoSolicitacao {
    id_tipo_solicitacao: number;
    nome: string;
}

export interface LocaisResponse {
    data: {
        locais: Local[];
    };
}

export interface CursosResponse {
    data: {
        cursos: Curso[];
    };
}

export interface TiposSolicitacaoResponse {
    data: {
        tipoSolicitacao: TipoSolicitacao[];
    };
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

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
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
 * Lista todos os locais
 */
export async function listarLocais(): Promise<LocaisResponse> {
    const response = await authenticatedFetch("/local/");
    return await response.json();
}

/**
 * Lista todos os cursos
 */
export async function listarCursos(): Promise<CursosResponse> {
    const response = await authenticatedFetch("/curso/");
    return await response.json();
}

/**
 * Lista todos os tipos de solicitação
 */
export async function listarTiposSolicitacao(): Promise<TiposSolicitacaoResponse> {
    const response = await authenticatedFetch("/tipo-solicitacao/");
    return await response.json();
}
