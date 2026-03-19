import { FileText, FileCode, X } from 'lucide-react';
import { useExport } from '../../context/ExportContext';

function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function generateMarkdown(commands: Map<string, { title: string; command: string }>): string {
  const lines: string[] = [
    '# Nmap2Pwn — Exported Commands',
    '',
    `> Generated on ${new Date().toISOString().split('T')[0]}`,
    '',
    '---',
    '',
  ];

  for (const [, { title, command }] of commands) {
    lines.push(`### ${title}`, '', '```bash', command, '```', '');
  }

  return lines.join('\n');
}

function generateBash(commands: Map<string, { title: string; command: string }>): string {
  const lines: string[] = [
    '#!/bin/bash',
    '# ============================================',
    '# Nmap2Pwn — Exported Commands',
    `# Generated on ${new Date().toISOString().split('T')[0]}`,
    '# ============================================',
    '',
  ];

  for (const [, { title, command }] of commands) {
    lines.push(`# ${title}`, command, '');
  }

  return lines.join('\n');
}

export default function ExportPanel() {
  const { selectedCommands, selectedCount, clearSelection } = useExport();

  if (selectedCount === 0) return null;

  const handleExportMd = () => {
    const content = generateMarkdown(selectedCommands);
    downloadFile('nmap2pwn-export.md', content, 'text/markdown');
  };

  const handleExportSh = () => {
    const content = generateBash(selectedCommands);
    downloadFile('nmap2pwn-export.sh', content, 'application/x-sh');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border-primary bg-bg-card/95 backdrop-blur-sm animate-slide-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <span className="text-sm text-text-primary font-mono">
          <span className="text-accent font-bold">{selectedCount}</span>
          {' '}command{selectedCount !== 1 ? 's' : ''} selected
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportMd}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            Export .md
          </button>
          <button
            onClick={handleExportSh}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
          >
            <FileCode className="w-3.5 h-3.5" />
            Export .sh
          </button>
          <button
            onClick={clearSelection}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded text-sm text-text-dim hover:text-red-400 hover:bg-red-400/10 transition-colors"
            title="Clear selection"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
