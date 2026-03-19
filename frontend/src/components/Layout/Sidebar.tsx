import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getAllPorts } from '../../services/api';
import type { PortSummary } from '../../types';

export default function Sidebar() {
  const [ports, setPorts] = useState<PortSummary[]>([]);
  const { id } = useParams();

  useEffect(() => {
    getAllPorts()
      .then((data) => setPorts(data.ports))
      .catch(() => {});
  }, []);

  if (ports.length === 0) return null;

  return (
    <aside className="w-56 shrink-0 border-r border-border-primary bg-bg-card/50 hidden lg:block overflow-y-auto">
      <div className="p-3">
        <h3 className="text-xs font-semibold text-text-dim uppercase tracking-wider mb-3 px-2">
          Ports
        </h3>
        <nav className="flex flex-col gap-0.5">
          {ports.map((p) => (
            <Link
              key={p.port}
              to={`/ports/${p.port}`}
              className={`flex items-center justify-between px-2 py-1.5 rounded text-sm transition-colors ${
                id === String(p.port)
                  ? 'bg-accent/10 text-accent'
                  : 'text-text-muted hover:text-text-primary hover:bg-bg-input'
              }`}
            >
              <span className="font-mono">{p.port}</span>
              <span className="text-xs text-text-dim">{p.service}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
