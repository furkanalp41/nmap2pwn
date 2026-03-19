import { useState } from 'react';
import { Radar, Loader2 } from 'lucide-react';

interface Props {
  onParse: (raw: string) => Promise<void>;
  loading: boolean;
}

const PLACEHOLDER = `Paste your Nmap output here...

Example:
Nmap scan report for 10.10.10.161
PORT     STATE SERVICE
88/tcp   open  kerberos-sec
135/tcp  open  msrpc
139/tcp  open  netbios-ssn
389/tcp  open  ldap
445/tcp  open  microsoft-ds
5985/tcp open  wsman`;

export default function NmapInput({ onParse, loading }: Props) {
  const [raw, setRaw] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (raw.trim()) onParse(raw);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative">
        <textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder={PLACEHOLDER}
          rows={12}
          spellCheck={false}
          className="w-full bg-bg-input border border-border-primary rounded-lg px-4 py-3 font-mono text-sm text-text-primary placeholder:text-text-dim/60 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 resize-y transition-colors"
        />
      </div>
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading || !raw.trim()}
          className="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover text-bg-primary font-semibold text-sm rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Radar className="w-4 h-4" />
          )}
          {loading ? 'Parsing...' : 'Parse Scan'}
        </button>
        {raw.trim() && (
          <button
            type="button"
            onClick={() => setRaw('')}
            className="px-3 py-2.5 text-sm text-text-dim hover:text-text-muted transition-colors"
          >
            Clear
          </button>
        )}
      </div>
    </form>
  );
}
