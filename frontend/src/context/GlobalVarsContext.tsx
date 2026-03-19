import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

const VAR_KEYS = ['IP', 'TARGET_IP', 'USERNAME', 'PASSWORD', 'DOMAIN', 'HASH', 'WORDLIST'] as const;
export type VarKey = (typeof VAR_KEYS)[number];
export { VAR_KEYS };

interface GlobalVarsContextType {
  vars: Record<string, string>;
  setVar: (key: string, value: string) => void;
  removeVar: (key: string) => void;
  clearAll: () => void;
  hasAnyValue: boolean;
  customKeys: string[];
  addCustomKey: (key: string) => void;
  removeCustomKey: (key: string) => void;
}

const GlobalVarsContext = createContext<GlobalVarsContextType | null>(null);

export function GlobalVarsProvider({ children }: { children: ReactNode }) {
  const [vars, setVars] = useState<Record<string, string>>({});
  const [customKeys, setCustomKeys] = useState<string[]>([]);

  const setVar = useCallback((key: string, value: string) => {
    setVars((prev) => ({ ...prev, [key]: value }));
  }, []);

  const removeVar = useCallback((key: string) => {
    setVars((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setVars({});
    setCustomKeys([]);
  }, []);

  const addCustomKey = useCallback((key: string) => {
    const normalized = key.toUpperCase().replace(/[^A-Z0-9_]/g, '');
    if (!normalized) return;
    setCustomKeys((prev) => (prev.includes(normalized) ? prev : [...prev, normalized]));
  }, []);

  const removeCustomKey = useCallback((key: string) => {
    setCustomKeys((prev) => prev.filter((k) => k !== key));
    setVars((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const hasAnyValue = Object.values(vars).some((v) => v.trim() !== '');

  return (
    <GlobalVarsContext.Provider value={{ vars, setVar, removeVar, clearAll, hasAnyValue, customKeys, addCustomKey, removeCustomKey }}>
      {children}
    </GlobalVarsContext.Provider>
  );
}

export function useGlobalVars() {
  const ctx = useContext(GlobalVarsContext);
  if (!ctx) throw new Error('useGlobalVars must be used within GlobalVarsProvider');
  return ctx;
}
