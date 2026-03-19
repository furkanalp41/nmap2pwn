import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, ChevronRight } from 'lucide-react';
import PortBadge from '../components/PortBadge/PortBadge';
import { getAllPorts } from '../services/api';
import type { PortSummary } from '../types';

export default function BrowsePorts() {
  const [ports, setPorts] = useState<PortSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllPorts()
      .then((data) => setPorts(data.ports))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-text-primary">Browse Ports</h2>
        <p className="text-sm text-text-dim mt-1">
          Select a port to view all available pentesting commands.
        </p>
      </div>

      <div className="grid gap-2">
        {ports.map((p) => (
          <Link
            key={p.port}
            to={`/ports/${p.port}`}
            className="flex items-center justify-between px-4 py-3 rounded-lg border border-border-primary bg-bg-card/50 hover:border-border-hover hover:bg-bg-card transition-colors group"
          >
            <div className="flex items-center gap-4">
              <PortBadge port={p.port} service={p.service} />
              <span className="text-sm text-text-dim hidden sm:inline">
                {p.description}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-dim">
                {p.tool_count} {p.tool_count === 1 ? 'tool' : 'tools'}
              </span>
              <ChevronRight className="w-4 h-4 text-text-dim group-hover:text-accent transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
