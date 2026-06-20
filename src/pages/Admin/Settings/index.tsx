import { useState } from 'react';
import { NavLink, Outlet, Navigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import {
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@evoapi/design-system';
import { Mail, MailOpen, HardDrive, KeyRound, MessageSquare, Sparkles, Puzzle, Globe, Cable, Menu } from 'lucide-react';

const navItems = [
  { key: 'email', path: '/settings/admin/email', icon: Mail },
  { key: 'storage', path: '/settings/admin/storage', icon: HardDrive },
  { key: 'socialLogin', path: '/settings/admin/social-login', icon: KeyRound },
  { key: 'channels', path: '/settings/admin/channels', icon: MessageSquare },
  { key: 'openai', path: '/settings/admin/openai', icon: Sparkles },
  { key: 'integrations', path: '/settings/admin/integrations', icon: Puzzle },
  { key: 'evolutionHub', path: '/settings/admin/evolution-hub', icon: Cable },
  { key: 'inboundEmail', path: '/settings/admin/inbound-email', icon: MailOpen },
  { key: 'frontendRuntime', path: '/settings/admin/frontend-runtime', icon: Globe },
] as const;

function NavList({ onClick }: { onClick?: () => void }) {
  const { t } = useLanguage('adminSettings');
  return (
    <nav className="space-y-1">
      {navItems.map(({ key, path, icon: Icon }) => (
        <NavLink
          key={key}
          to={path}
          onClick={onClick}
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
              isActive
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
            }`
          }
        >
          <Icon className="h-4 w-4 shrink-0" />
          {t(`navigation.${key}`)}
        </NavLink>
      ))}
    </nav>
  );
}

export default function AdminSettingsLayout() {
  const { t } = useLanguage('adminSettings');
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (location.pathname === '/settings/admin' || location.pathname === '/settings/admin/') {
    return <Navigate to="/settings/admin/email" replace />;
  }

  return (
    <div className="flex h-full">
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-40">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-sidebar-foreground bg-sidebar/80 backdrop-blur-sm rounded-lg shadow-md">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Abrir menu de configurações</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 !bg-sidebar text-sidebar-foreground">
            <SheetHeader className="border-b border-sidebar-border p-4">
              <SheetTitle className="text-left text-sm font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
                {t('title')}
              </SheetTitle>
            </SheetHeader>
            <div className="p-4">
              <NavList onClick={() => setMobileMenuOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 shrink-0 flex-col border-r border-sidebar-border p-4">
        <h3 className="text-sm font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-4">
          {t('title')}
        </h3>
        <NavList />
      </aside>

      <main className="flex-1 overflow-auto p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  );
}
