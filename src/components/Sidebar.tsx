import Link from 'next/link';
import styled from 'styled-components';

interface SidebarProps {
  $isCollapsed: boolean;
}

export const Sidebar = styled.aside<SidebarProps>`
  width: ${props => props.$isCollapsed ? '80px' : '260px'};
  background: white;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  transition: all 0.3s ease;
  border-right: 1px solid #e5e7eb;

  .dark & {
    background: #1f2937;
    border-right: none;
  }
`;

export const ToggleButton = styled.button`
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
  }

  svg {
    width: 20px;
    height: 20px;
    color: #111827;
    transition: all 0.3s ease;
  }

  .dark & {
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    svg {
      color: white;
    }
  }
`;

export const SidebarHeader = styled.div<SidebarProps>`
  padding: 24px 20px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  transition: border-color 0.3s ease;

  .dark & {
    border-bottom-color: rgba(255, 255, 255, 0.1);
  }
`;

export const SidebarMenu = styled.nav`
  flex: 1;
  padding: 20px 0;
  overflow-y: auto;
`;

export const MenuItem = styled.a<SidebarProps>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: #4b5563;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  overflow: hidden;

  &:hover {
    background: #f3f4f6;
    color: #111827;
  }

  &.active {
    background: rgba(37, 99, 235, 0.1);
    color: #2563eb;
    border-left: 3px solid #2563eb;
  }

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }

  span {
    opacity: ${props => props.$isCollapsed ? '0' : '1'};
    transition: opacity 0.2s ease;
  }

  .dark & {
    color: #d1d5db;

    &:hover {
      background: rgba(255, 255, 255, 0.05);
      color: white;
    }

    &.active {
      background: rgba(37, 99, 235, 0.1);
      color: #60a5fa;
      border-left: 3px solid #2563eb;
    }
  }
`;

export const SidebarFooter = styled.div`
  padding: 20px;
  border-top: 1px solid #e5e7eb;
  transition: border-color 0.3s ease;

  .dark & {
    border-top-color: rgba(255, 255, 255, 0.1);
  }
`;

export const LogoutButton = styled.button<SidebarProps>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
  justify-content: ${props => props.$isCollapsed ? 'center' : 'flex-start'};

  &:hover {
    background: rgba(239, 68, 68, 0.2);
    border-color: rgba(239, 68, 68, 0.5);
  }

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }

  span {
    opacity: ${props => props.$isCollapsed ? '0' : '1'};
    transition: opacity 0.2s ease;
  }
`;

export const Header = styled.header`
  height: 70px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  position: sticky;
  top: 0;
  z-index: 10;
  transition: all 0.3s ease;

  .dark & {
    background: #1f2937;
    border-bottom-color: #374151;
  }
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

export const HeaderCenter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

export const HeaderTitle = styled.h1`
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0;

  .dark & {
    color: #f9fafb;
  }
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  flex: 1;
`;

export const DarkModeButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: #f3f4f6;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e5e7eb;
  }

  svg {
    width: 18px;
    height: 18px;
    color: #374151;
  }

  .dark & {
    background: #374151;

    &:hover {
      background: #4b5563;
    }

    svg {
      color: #d1d5db;
    }
  }
`;

export const HeaderUserName = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  transition: color 0.3s ease;

  .dark & {
    color: #f9fafb;
  }
`;

export const MainContainer = styled.div<SidebarProps>`
  margin-left: ${props => props.$isCollapsed ? '80px' : '260px'};
  min-height: 100vh;
  background: white;
  transition: all 0.3s ease;

  .dark & {
    background: #111827;
  }
`;

export const MainContent = styled.main`
  padding: 32px;
`;

export const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 24px;
  transition: color 0.3s ease;

  .dark & {
    color: #f9fafb;
  }
`;

// Componente wrapper para MenuItem com Link do Next.js
export const MenuItemLink = ({ href, className, $isCollapsed, children }: {
  href?: string;
  className?: string;
  $isCollapsed: boolean;
  children: React.ReactNode
}) => {
  if (!href) {
    return <MenuItem as="div" className={className} $isCollapsed={$isCollapsed}>{children}</MenuItem>;
  }

  return (
    <Link href={href} passHref legacyBehavior>
      <MenuItem className={className} $isCollapsed={$isCollapsed}>{children}</MenuItem>
    </Link>
  );
};
