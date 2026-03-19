import CommandCard from './CommandCard';
import type { Tool } from '../../types';
import { Wrench } from 'lucide-react';

interface Props {
  tool: Tool;
  portId: number;
  toolIndex: number;
}

export default function CommandList({ tool, portId, toolIndex }: Props) {
  return (
    <div className="space-y-3">
      {/* Tool header */}
      <div className="flex items-start gap-2">
        <Wrench className="w-4 h-4 text-accent mt-0.5 shrink-0" />
        <div>
          <h4 className="text-sm font-semibold text-text-primary">
            {tool.name}
          </h4>
          {tool.description && (
            <p className="text-xs text-text-dim mt-0.5">{tool.description}</p>
          )}
        </div>
      </div>

      {/* Command cards */}
      <div className="space-y-2 ml-6">
        {tool.commands.map((cmd, cmdIdx) => (
          <CommandCard
            key={cmdIdx}
            command={cmd}
            id={`${portId}-${toolIndex}-${cmdIdx}`}
          />
        ))}
      </div>
    </div>
  );
}
