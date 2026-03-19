import { Link, useLocation } from 'react-router-dom';
import { Terminal, Search, Settings2 } from 'lucide-react';
import { useGlobalVars } from '../../context/GlobalVarsContext';

interface Props {
  panelOpen: boolean;
  onTogglePanel: () => void;
}

export default function Header({ panelOpen, onTogglePanel }: Props) {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { hasAnyValue } = useGlobalVars();

  return (
    <header className="border-b border-border-primary bg-bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-accent hover:text-accent-hover transition-colors">
          <Terminal className="w-5 h-5" />
          <span className="text-lg font-bold tracking-tight">
            nmap2pwn<span className="cursor-blink text-accent">_</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded text-sm transition-colors ${
              isHome
                ? 'text-accent bg-accent/10'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Parse
          </Link>
          <Link
            to="/ports"
            className={`px-3 py-1.5 rounded text-sm transition-colors flex items-center gap-1.5 ${
              !isHome
                ? 'text-accent bg-accent/10'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            Browse
          </Link>

          <div className="w-px h-5 bg-border-primary mx-1" />

          <button
            onClick={onTogglePanel}
            className={`relative px-3 py-1.5 rounded text-sm transition-colors flex items-center gap-1.5 ${
              panelOpen
                ? 'text-accent bg-accent/10'
                : 'text-text-muted hover:text-text-primary'
            }`}
            title="Toggle global variables panel"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Variables</span>
            {hasAnyValue && !panelOpen && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
