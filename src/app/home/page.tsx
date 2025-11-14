'use client';

import { DashboardStats } from '@/components/home/DashboardStats';
import { HomeLayout } from '@/components/home/HomeLayout';
import { RecentTickets } from '@/components/home/RecentTickets';
import { MainContent, PageTitle } from '@/components/Sidebar';
import { useHomePage } from '@/hooks/useHomePage';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const {

    user,
    isDarkMode,
    toggleTheme,
    isCollapsed,
    toggleSidebar,
    getInitials,
    handleLogout,
    stats,
    recentTickets,

  } = useHomePage();

  if (!user) {
    router.push('/');
    return null;
  }

  return (
    <HomeLayout
      isCollapsed={isCollapsed}
      toggleSidebar={toggleSidebar}
      isDarkMode={isDarkMode}
      toggleTheme={toggleTheme}
      username={user.username}
      getInitials={getInitials}
      handleLogout={handleLogout}
    >
      <MainContent>
        <PageTitle>Dashboard</PageTitle>

        {stats && (
          <DashboardStats
            totalTickets={stats.totalTickets}
            openTickets={stats.openTickets}
            inProgressTickets={stats.inProgressTickets}
            resolvedTickets={stats.resolvedTickets}
          />
        )}

        <RecentTickets tickets={recentTickets} isAdmin={user.isAdmin} />
      </MainContent>
    </HomeLayout>
  );
}
