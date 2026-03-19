import { useState } from 'react';
import toast from 'react-hot-toast';
import { Shield, AlertTriangle } from 'lucide-react';
import NmapInput from '../components/NmapInput/NmapInput';
import CommandList from '../components/CommandCard/CommandList';
import PortBadge from '../components/PortBadge/PortBadge';
import { parseNmap } from '../services/api';
import { useGlobalVars } from '../context/GlobalVarsContext';
import type { ParseResponse } from '../types';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ParseResponse | null>(null);
  const { setVar } = useGlobalVars();

  const handleParse = async (raw: string) => {
    setLoading(true);
    try {
      const data = await parseNmap(raw);
      setResult(data);
      // Auto-set the IP in Global Variables
      setVar('IP', data.ip);
      toast.success(`Parsed ${data.open_ports.length} open ports on ${data.ip}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Parse failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Input section */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent" />
            Paste Nmap Output
          </h2>
          <p className="text-sm text-text-dim mt-1">
            Paste your raw Nmap scan results below. The parser will extract the
            target IP and open ports, then provide ready-to-use pentesting commands.
          </p>
        </div>
        <NmapInput onParse={handleParse} loading={loading} />
      </section>

      {/* Results */}
      {result && (
        <>
          {/* Target banner */}
          <section className="border border-accent/20 rounded-lg bg-accent/5 px-5 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
              <div>
                <span className="text-xs text-text-dim uppercase tracking-wider">Target</span>
                <p className="text-lg font-bold text-accent font-mono">{result.ip}</p>
              </div>
              <div className="h-8 w-px bg-border-primary hidden sm:block" />
              <div>
                <span className="text-xs text-text-dim uppercase tracking-wider">
                  Open Ports ({result.open_ports.length})
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {result.matched_ports.map((p) => (
                    <PortBadge key={p.port} port={p.port} service={p.service} />
                  ))}
                  {result.unmatched_ports.map((p) => (
                    <PortBadge key={p} port={p} variant="unmatched" />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Matched port sections */}
          {result.matched_ports.map((portData) => (
            <section key={portData.port} className="space-y-4">
              <div className="flex items-baseline gap-3 border-b border-border-primary pb-3">
                <h3 className="text-lg font-bold text-text-primary font-mono">
                  {portData.port}/{portData.protocol}
                </h3>
                <span className="text-sm text-accent font-semibold">
                  {portData.service}
                </span>
                <span className="text-xs text-text-dim hidden sm:inline">
                  {portData.description}
                </span>
              </div>

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
            </section>
          ))}

          {/* Unmatched ports */}
          {result.unmatched_ports.length > 0 && (
            <section className="border border-amber/20 rounded-lg bg-amber/5 px-5 py-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber">
                    No commands available yet
                  </p>
                  <p className="text-xs text-text-dim mt-1">
                    Ports{' '}
                    {result.unmatched_ports.map((p) => (
                      <code key={p} className="text-amber bg-amber/10 rounded px-1 mx-0.5">
                        {p}
                      </code>
                    ))}{' '}
                    were detected as open but have no command templates in the database yet.
                  </p>
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
