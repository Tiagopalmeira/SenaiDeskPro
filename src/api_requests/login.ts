/**
 * Interface para o payload de login
 */
export interface LoginPayload {
    login: string;
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
 * @param login - Login de rede do usuário
 * @param senha - Senha do usuário
 * @returns Promise com a resposta do login
 */
export async function loginRequest(login: string, senha: string): Promise<LoginResponse> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

    const response = await fetch(`${apiUrl}/usuario/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            login,
            senha,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro no login: ${response.status}`);
    }

    return await response.json();
}
