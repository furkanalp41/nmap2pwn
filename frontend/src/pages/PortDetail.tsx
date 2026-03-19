import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import CommandList from '../components/CommandCard/CommandList';
import PortBadge from '../components/PortBadge/PortBadge';
import { getPort } from '../services/api';
import type { PortMatch } from '../types';

export default function PortDetail() {
  const { id } = useParams<{ id: string }>();
  const [portData, setPortData] = useState<PortMatch | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    getPort(Number(id))
      .then(setPortData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-accent animate-spin" />
      </div>
    );
  }

  if (error || !portData) {
    return (
      <div className="space-y-4">
        <Link
          to="/ports"
          className="inline-flex items-center gap-1.5 text-sm text-text-dim hover:text-accent transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          All ports
        </Link>
        <div className="border border-red-500/20 rounded-lg bg-red-500/5 px-5 py-4">
          <p className="text-sm text-red-400">
            {error || 'Port not found'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        to="/ports"
        className="inline-flex items-center gap-1.5 text-sm text-text-dim hover:text-accent transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        All ports
      </Link>

      {/* Port header */}
      <div className="flex items-baseline gap-3 border-b border-border-primary pb-4">
        <PortBadge port={portData.port} service={portData.service} />
        <span className="text-xs text-text-dim hidden sm:inline">
          {portData.description}
        </span>
      </div>

      {/* Tools & commands */}
      <div className="space-y-6">
        {portData.tools.map((tool, toolIdx) => (
          <CommandList
            key={toolIdx}
            tool={tool}
            portId={portData.port}
            toolIndex={toolIdx}
          />
        ))}
      </div>
    </div>
  );
}
