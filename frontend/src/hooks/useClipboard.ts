import { useState, useCallback, useRef } from 'react';

export function useClipboard(resetMs = 2000) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const copy = useCallback(
    async (text: string, id: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopiedId(id);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setCopiedId(null), resetMs);
      } catch {
        // Fallback for non-HTTPS contexts
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        setCopiedId(id);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setCopiedId(null), resetMs);
      }
    },
    [resetMs]
  );

  return { copy, copiedId };
}
