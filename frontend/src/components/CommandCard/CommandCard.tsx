import { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { useClipboard } from '../../hooks/useClipboard';
import { useGlobalVars } from '../../context/GlobalVarsContext';
import { useExport } from '../../context/ExportContext';
import type { Command } from '../../types';

interface Props {
  command: Command;
  id: string;
}

function substituteVars(command: string, vars: Record<string, string>): string {
  return command.replace(/\{\{(\w+)\}\}/g, (match, key) => vars[key] || match);
}

function renderCommand(text: string, vars: Record<string, string>) {
  const parts = text.split(/(\{\{[^}]+\}\})/g);
  return parts.map((part, i) => {
    const match = part.match(/^\{\{(\w+)\}\}$/);
    if (match) {
      const key = match[1];
      const value = vars[key];
      if (value) {
        // Filled — render in accent green
        return (
          <span key={i} className="text-accent bg-accent/10 rounded px-0.5">
            {value}
          </span>
        );
      }
      // Unfilled — render as amber placeholder
      return (
        <span key={i} className="text-amber bg-amber/10 rounded px-0.5">
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function CommandCard({ command, id }: Props) {
  const { copy, copiedId } = useClipboard();
  const { vars } = useGlobalVars();
  const { toggleCommand, isSelected } = useExport();
  const isCopied = copiedId === id;
  const [expanded, setExpanded] = useState(false);
  const selected = isSelected(id);

  const substitutedCommand = substituteVars(command.command, vars);

  return (
    <div className="group border border-border-primary rounded-lg bg-bg-card/50 hover:border-border-hover transition-colors">
      {/* Title row */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-primary">
        <div className="flex items-center gap-1.5 min-w-0">
          <button
            onClick={() => toggleCommand(id, command.title, substitutedCommand)}
            className={`shrink-0 transition-colors ${
              selected ? 'text-yellow-400' : 'text-text-dim hover:text-yellow-400/70'
            }`}
            title={selected ? 'Remove from export' : 'Add to export'}
          >
            <Star className="w-3.5 h-3.5" fill={selected ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={() => setExpanded((e) => !e)}
            className="flex items-center gap-1.5 text-sm text-text-primary font-medium hover:text-accent transition-colors text-left min-w-0"
          >
            {expanded ? (
              <ChevronUp className="w-3.5 h-3.5 text-text-dim shrink-0" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-text-dim shrink-0" />
            )}
            {command.title}
          </button>
        </div>
        <button
          onClick={() => copy(substitutedCommand, id)}
          className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-all shrink-0 ${
            isCopied
              ? 'text-accent bg-accent/10'
              : 'text-text-dim hover:text-accent hover:bg-accent/5'
          }`}
          title="Copy to clipboard"
        >
          {isCopied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Command block */}
      <div className="px-4 py-3 bg-bg-code/50">
        <pre className="text-sm font-mono text-text-primary whitespace-pre-wrap break-all leading-relaxed">
          <code>{renderCommand(command.command, vars)}</code>
        </pre>
      </div>

      {/* Expandable description */}
      {command.description && expanded && (
        <div className="px-4 py-3 border-t border-border-primary bg-bg-input/30">
          <p className="text-xs text-text-muted leading-relaxed">
            {command.description}
          </p>
        </div>
      )}
    </div>
  );
}
