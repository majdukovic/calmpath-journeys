import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, GraduationCap, Settings } from 'lucide-react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const tabs = [
    { id: '/', icon: Home, label: 'Home' },
    { id: '/journal', icon: BookOpen, label: 'Journal' },
    { id: 'sos', icon: null, label: 'SOS' },
    { id: '/learn', icon: GraduationCap, label: 'Learn' },
    { id: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 pb-24 overflow-y-auto">
        <div className="max-w-[600px] mx-auto px-grid-2">
          {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50" aria-label="Main navigation">
        <div className="max-w-[600px] mx-auto flex items-end justify-around px-grid py-grid relative">
          {tabs.map((tab) => {
            if (tab.id === 'sos') {
              return (
                <button
                  key="sos"
                  onClick={() => navigate('/sos')}
                  className="flex flex-col items-center -mt-6 relative"
                  aria-label="SOS - I need calm now"
                >
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center card-shadow animate-pulse-soft">
                    <span className="text-primary-foreground font-bold text-sm">SOS</span>
                  </div>
                </button>
              );
            }
            const Icon = tab.icon!;
            const isActive = path === tab.id || (tab.id !== '/' && path.startsWith(tab.id));
            const isHome = tab.id === '/' && path === '/';
            const active = isActive || isHome;
            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.id)}
                className={`flex flex-col items-center gap-1 py-grid min-w-[48px] min-h-[48px] justify-center transition-colors ${active ? 'text-primary' : 'text-muted-foreground'}`}
                aria-label={tab.label}
                aria-current={active ? 'page' : undefined}
              >
                <Icon size={22} />
                <span className="text-[10px] font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
