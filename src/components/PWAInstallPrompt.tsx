import React, { useEffect, useState } from 'react';
import { Button } from '@evoapi/design-system/button';
import { X, Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed',
    platform: string
  }>;
  prompt(): Promise<void>;
}

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.error('Service worker registration failed:', err);
      });
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      const hasDismissed = localStorage.getItem('pwa_prompt_dismissed');
      if (!hasDismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 bg-primary text-primary-foreground p-4 rounded-xl shadow-xl flex items-center justify-between z-[9999] animate-in slide-in-from-bottom-5">
      <div className="flex items-center gap-3">
        <div className="bg-primary-foreground/20 p-2 rounded-full">
          <Download className="h-5 w-5" />
        </div>
        <div>
          <p className="font-semibold text-sm">Instalar Aplicativo</p>
          <p className="text-xs opacity-90">Adicione à tela inicial</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" onClick={handleInstallClick} className="h-8 rounded-lg">
          Instalar
        </Button>
        <Button variant="ghost" size="icon" onClick={handleDismiss} className="h-8 w-8 hover:bg-primary-foreground/20">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
