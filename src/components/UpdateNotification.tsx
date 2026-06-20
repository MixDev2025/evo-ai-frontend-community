import { useServiceWorker } from '@/hooks/useServiceWorker';
import { Button } from '@evoapi/design-system/button';
import { RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';

export function UpdateNotification() {
  const { updateAvailable, update } = useServiceWorker();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (updateAvailable) setDismissed(false);
  }, [updateAvailable]);

  if (!updateAvailable || dismissed) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[99999] animate-in fade-in slide-in-from-top-2">
      <div className="bg-[#0F1923] border border-[#00FFA7]/30 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-xl">
        <RefreshCw className="h-4 w-4 text-[#00FFA7]" />
        <p className="text-sm font-medium">Nova versão disponível</p>
        <Button
          size="sm"
          onClick={() => {
            update();
            window.location.reload();
          }}
          className="h-7 px-3 rounded-lg bg-[#00FFA7] text-[#0F1923] hover:bg-[#00FFA7]/90 font-semibold text-xs"
        >
          Atualizar
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDismissed(true)}
          className="h-7 w-7 hover:bg-white/10 text-white/60"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </Button>
      </div>
    </div>
  );
}
