import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface SelectedCommand {
  title: string;
  command: string;
}

interface ExportContextType {
  selectedCommands: Map<string, SelectedCommand>;
  toggleCommand: (id: string, title: string, command: string) => void;
  isSelected: (id: string) => boolean;
  clearSelection: () => void;
  selectedCount: number;
}

const ExportContext = createContext<ExportContextType | null>(null);

export function ExportProvider({ children }: { children: ReactNode }) {
  const [selectedCommands, setSelectedCommands] = useState<Map<string, SelectedCommand>>(new Map());

  const toggleCommand = useCallback((id: string, title: string, command: string) => {
    setSelectedCommands((prev) => {
      const next = new Map(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.set(id, { title, command });
      }
      return next;
    });
  }, []);

  const isSelected = useCallback(
    (id: string) => selectedCommands.has(id),
    [selectedCommands],
  );

  const clearSelection = useCallback(() => {
    setSelectedCommands(new Map());
  }, []);

  const selectedCount = selectedCommands.size;

  return (
    <ExportContext.Provider value={{ selectedCommands, toggleCommand, isSelected, clearSelection, selectedCount }}>
      {children}
    </ExportContext.Provider>
  );
}

export function useExport() {
  const ctx = useContext(ExportContext);
  if (!ctx) throw new Error('useExport must be used within ExportProvider');
  return ctx;
}
