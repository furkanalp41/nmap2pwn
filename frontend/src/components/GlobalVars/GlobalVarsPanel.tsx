import { X, Trash2 } from 'lucide-react';
import { useGlobalVars, VAR_KEYS } from '../../context/GlobalVarsContext';

const VAR_LABELS: Record<string, { label: string; placeholder: string; type?: string }> = {
  IP: { label: 'Target IP', placeholder: '10.10.10.100' },
  TARGET_IP: { label: 'Relay Target', placeholder: '10.10.10.200' },
  USERNAME: { label: 'Username', placeholder: 'administrator' },
  PASSWORD: { label: 'Password', placeholder: 'P@ssw0rd!', type: 'text' },
  DOMAIN: { label: 'Domain', placeholder: 'corp.local' },
  HASH: { label: 'NT Hash', placeholder: 'aad3b435...' },
  WORDLIST: { label: 'Wordlist', placeholder: '/usr/share/wordlists/rockyou.txt' },
};

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function GlobalVarsPanel({ open, onClose }: Props) {
  const { vars, setVar, clearAll, hasAnyValue } = useGlobalVars();

  if (!open) return null;

  return (
    <div className="border-b border-border-primary bg-bg-card/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-text-primary">Global Variables</h3>
            <span className="text-xs text-text-dim">
              Fill in once — commands update everywhere
            </span>
          </div>
          <div className="flex items-center gap-2">
            {hasAnyValue && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1 px-2 py-1 text-xs text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 text-text-dim hover:text-text-primary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Variable inputs grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {VAR_KEYS.map((key) => {
            const meta = VAR_LABELS[key];
            return (
              <div key={key} className="relative">
                <label className="block text-[10px] font-semibold text-text-dim uppercase tracking-wider mb-1">
                  {meta.label}
                  <span className="text-accent/60 ml-1">{`{{${key}}}`}</span>
                </label>
                <div className="relative">
                  <input
                    type={meta.type || 'text'}
                    value={vars[key] || ''}
                    onChange={(e) => setVar(key, e.target.value)}
                    placeholder={meta.placeholder}
                    spellCheck={false}
                    autoComplete="off"
                    className="w-full bg-bg-input border border-border-primary rounded px-2.5 py-1.5 font-mono text-xs text-text-primary placeholder:text-text-dim/40 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-colors pr-7"
                  />
                  {vars[key] && (
                    <button
                      onClick={() => setVar(key, '')}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 text-text-dim hover:text-text-primary transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
