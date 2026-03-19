import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

const VAR_KEYS = ['IP', 'TARGET_IP', 'USERNAME', 'PASSWORD', 'DOMAIN', 'HASH', 'WORDLIST'] as const;
export type VarKey = (typeof VAR_KEYS)[number];
export { VAR_KEYS };

interface GlobalVarsContextType {
  vars: Record<string, string>;
  setVar: (key: string, value: string) => void;
  clearAll: () => void;
  hasAnyValue: boolean;
}

const GlobalVarsContext = createContext<GlobalVarsContextType | null>(null);

export function GlobalVarsProvider({ children }: { children: ReactNode }) {
  const [vars, setVars] = useState<Record<string, string>>({});

  const setVar = useCallback((key: string, value: string) => {
    setVars((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearAll = useCallback(() => {
    setVars({});
  }, []);

  const hasAnyValue = Object.values(vars).some((v) => v.trim() !== '');

  return (
    <GlobalVarsContext.Provider value={{ vars, setVar, clearAll, hasAnyValue }}>
      {children}
    </GlobalVarsContext.Provider>
  );
}

export function useGlobalVars() {
  const ctx = useContext(GlobalVarsContext);
  if (!ctx) throw new Error('useGlobalVars must be used within GlobalVarsProvider');
  return ctx;
}
