"use client";

import { UserAvatar } from "@/components/Header";
import {
    DarkModeButton,
    Header,
    HeaderLeft,
    HeaderRight,
    HeaderTitle,
    HeaderUserName,
    LogoutButton,
    MainContainer,
    MainContent,
    MenuItemLink,
    PageTitle,
    Sidebar,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    ToggleButton,
} from "@/components/Sidebar";
import {
    EmptyDescription,
    EmptyIcon,
    EmptyState,
    EmptyTitle,
    FilterBar,
    NewTicketButton,
    SearchInput,
    TicketsGrid,
} from "@/components/chamados/ChamadosStyles";
import { NewTicketModal, TicketFormData } from "@/components/chamados/NewTicketModal";
import { TicketCard } from "@/components/chamados/TicketCard";
import { TicketDetailModal } from "@/components/chamados/TicketDetailModal";
import { FilterModal } from "@/components/chamados/FilterModal";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useSolicitacoes } from "@/hooks/useSolicitacoes";
import { criarSolicitacao } from "@/api_requests/solicitacoes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ChamadosPage() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [selectedSolicitacao, setSelectedSolicitacao] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Obtém o ID do usuário
    const userId = user?.id_usuario || 1; // Fallback para desenvolvimento

    const { solicitacoes, loading, error, filtros, atualizarFiltros, recarregar } = useSolicitacoes({
        userId,
        isAdmin: user?.isAdmin || false,
    });

    useEffect(() => {
        if (!user) {
            router.push("/");
        }
    }, [user, router]);

    // Aplica filtro de busca
    useEffect(() => {
        atualizarFiltros({ searchTerm: searchTerm || undefined });
    }, [searchTerm, atualizarFiltros]);

    if (!user) {
        return null;
    }

    const getInitials = (username: string) => {
        const names = username.split(" ");
        if (names.length >= 2) {
            return names[0][0] + names[names.length - 1][0];
        }
        return username.substring(0, 2);
    };

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    const priorityMap: Record<string, 0 | 1 | 2> = {
        urgente: 2,
        media: 1,
        baixa: 0,
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(((reader.result as string) || "").split(",")[1] || "");
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleNewTicket = async (ticketData: TicketFormData) => {
        if (!user?.id_usuario) return;

        try {
            const imagemBase64 = ticketData.imagem ? await fileToBase64(ticketData.imagem) : undefined;

            await criarSolicitacao({
                usuarioId: user.id_usuario,
                localId: Number(ticketData.localId),
                tipoSolicitacaoId: Number(ticketData.tipoSolicitacaoId),
                cursoId: ticketData.cursoId ? Number(ticketData.cursoId) : undefined,
                descricao: ticketData.descricao,
                prioridade: priorityMap[ticketData.prioridade] ?? 0,
                imagemBase64,
            });

            recarregar();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Erro ao criar chamado", error);
            alert("Não foi possível criar o chamado. Tente novamente.");
        }
    };

    const solicitacaoSelecionada = selectedSolicitacao
        ? solicitacoes.find((s) => s.id_solicitacao === selectedSolicitacao)
        : null;

    return (
        <>
            <Sidebar $isCollapsed={isCollapsed}>
                <SidebarHeader $isCollapsed={isCollapsed}>
                    <ToggleButton onClick={() => setIsCollapsed(!isCollapsed)}>
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </ToggleButton>
                </SidebarHeader>

                <SidebarMenu>
                    <MenuItemLink href="/home" $isCollapsed={isCollapsed}>
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                        </svg>
                        <span>Início</span>
                    </MenuItemLink>

                    <MenuItemLink href="/chamados" className="active" $isCollapsed={isCollapsed}>
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                        </svg>
                        <span>Chamados</span>
                    </MenuItemLink>

                    <MenuItemLink href="/config" $isCollapsed={isCollapsed}>
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                        </svg>
                        <span>Configurações</span>
                    </MenuItemLink>
                </SidebarMenu>

                <SidebarFooter>
                    <LogoutButton $isCollapsed={isCollapsed} onClick={handleLogout}>
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                        </svg>
                        <span>Sair</span>
                    </LogoutButton>
                </SidebarFooter>
            </Sidebar>

            <MainContainer $isCollapsed={isCollapsed}>
                <Header>
                    <HeaderLeft>
                        <HeaderTitle>Senai Desk Pro</HeaderTitle>
                    </HeaderLeft>
                    <HeaderRight>
                        <HeaderUserName>{user.username}</HeaderUserName>
                        <UserAvatar>{getInitials(user.username)}</UserAvatar>
                        <DarkModeButton onClick={toggleTheme}>
                            {isDarkMode ? (
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                                    />
                                </svg>
                            ) : (
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                                    />
                                </svg>
                            )}
                        </DarkModeButton>
                    </HeaderRight>
                </Header>

                <MainContent>
                    <PageTitle>Chamados</PageTitle>

                    <FilterBar>
                        <SearchInput
                            type="text"
                            placeholder="Buscar por descrição ou ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        <NewTicketButton onClick={() => setIsFilterModalOpen(true)} style={{ background: "#6b7280" }}>
                            <svg
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                style={{ width: "18px", height: "18px" }}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                                />
                            </svg>
                        </NewTicketButton>

                        {!user.isAdmin && (
                            <NewTicketButton onClick={() => setIsModalOpen(true)}>
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                                Novo Chamado
                            </NewTicketButton>
                        )}
                    </FilterBar>

                    {loading ? (
                        <EmptyState>
                            <EmptyIcon>
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                </svg>
                            </EmptyIcon>
                            <EmptyTitle>Carregando...</EmptyTitle>
                        </EmptyState>
                    ) : error ? (
                        <EmptyState>
                            <EmptyIcon>
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </EmptyIcon>
                            <EmptyTitle>Erro ao carregar</EmptyTitle>
                            <EmptyDescription>{error}</EmptyDescription>
                        </EmptyState>
                    ) : solicitacoes.length > 0 ? (
                        <TicketsGrid>
                            {solicitacoes.map((solicitacao) => (
                                <TicketCard
                                    key={solicitacao.id_solicitacao}
                                    solicitacao={solicitacao}
                                    onClick={() => setSelectedSolicitacao(solicitacao.id_solicitacao)}
                                />
                            ))}
                        </TicketsGrid>
                    ) : (
                        <EmptyState>
                            <EmptyIcon>
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                            </EmptyIcon>
                            <EmptyTitle>Nenhum chamado encontrado</EmptyTitle>
                            <EmptyDescription>
                                {searchTerm || Object.keys(filtros).length > 0
                                    ? "Tente ajustar os filtros de busca"
                                    : "Não há chamados cadastrados no momento"}
                            </EmptyDescription>
                        </EmptyState>
                    )}
                </MainContent>
            </MainContainer>

            <NewTicketModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleNewTicket}
                userName={user.nome}
                userMatricula={user.matricula}
                userCargo={user.cargo}
            />

            <FilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                filtros={filtros}
                onApply={atualizarFiltros}
            />

            {solicitacaoSelecionada && (
                <TicketDetailModal
                    isOpen={!!selectedSolicitacao}
                    onClose={() => setSelectedSolicitacao(null)}
                    solicitacao={solicitacaoSelecionada}
                    userId={userId}
                    isAdmin={user.isAdmin}
                    onUpdate={() => {
                        recarregar();
                        setSelectedSolicitacao(null);
                    }}
                />
            )}
        </>
    );
}
