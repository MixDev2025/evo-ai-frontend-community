import React, { useEffect, useState } from 'react';
import { Button } from '@evoapi/design-system/button';
import { X, Download, Smartphone } from 'lucide-react';

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
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream);

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

  if (isStandalone || !showPrompt) return null;

  // iOS-specific prompt (since beforeinstallprompt doesn't fire on iOS)
  if (isIOS) {
    return (
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 bg-gradient-to-r from-[#0F1923] to-[#1A1A2E] border border-[#00FFA7]/20 text-white p-4 rounded-xl shadow-2xl flex items-start gap-3 z-[9999] animate-in slide-in-from-bottom-5">
        <div className="shrink-0 mt-1">
          <Smartphone className="h-5 w-5 text-[#00FFA7]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-white">Instalar ChatMix</p>
          <p className="text-xs text-white/60 mt-1">
            Toque em <span className="inline-flex items-center gap-1 text-white/80"><svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg> Compartilhar</span> e depois em <span className="font-semibold text-white/80">Adicionar à Tela de Início</span>
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleDismiss} className="h-6 w-6 shrink-0 hover:bg-white/10 text-white/60">
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 bg-gradient-to-r from-[#0F1923] to-[#1A1A2E] border border-[#00FFA7]/20 text-white p-4 rounded-xl shadow-2xl flex items-center gap-3 z-[9999] animate-in slide-in-from-bottom-5 backdrop-blur-xl">
      <div className="shrink-0">
        <svg width="40" height="40" viewBox="0 0 512 512" className="rounded-lg">
          <defs>
            <linearGradient id="pg1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#00FFA7"/>
              <stop offset="100%" stop-color="#00D68F"/>
            </linearGradient>
            <linearGradient id="pg2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#00B8FF"/>
              <stop offset="100%" stop-color="#4A00E0"/>
            </linearGradient>
          </defs>
          <rect width="512" height="512" rx="100" fill="#0F1923"/>
          <path d="M370 200c0-55-45-100-100-100s-100 45-100 100c0 30 13 57 34 76l-18 54 58-28c23 8 48 9 72 2l57 28-18-56c20-18 33-44 33-72l-18-4z" fill="url(#pg1)" opacity="0.9"/>
          <path d="M280 180c0-44-36-80-80-80s-80 36-80 80c0 24 11 46 28 61l-14 44 48-24c18 7 38 8 56 2l46 24-14-46c16-15 26-36 26-59l-16-2z" fill="url(#pg2)" opacity="0.85" transform="translate(30, 60)"/>
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-white">Instalar ChatMix</p>
        <p className="text-xs text-white/60">Adicione à tela inicial para acesso rápido</p>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <Button
          variant="default"
          size="sm"
          onClick={handleInstallClick}
          className="h-8 px-3 rounded-lg bg-[#00FFA7] text-[#0F1923] hover:bg-[#00FFA7]/90 font-semibold text-xs"
        >
          <Download className="h-3.5 w-3.5 mr-1" />
          Instalar
        </Button>
        <Button variant="ghost" size="icon" onClick={handleDismiss} className="h-8 w-8 hover:bg-white/10 text-white/60">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
