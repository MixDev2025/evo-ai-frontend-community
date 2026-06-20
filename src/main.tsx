import { createRoot } from 'react-dom/client';
import "@evoapi/design-system/styles";
// React Flow CSS imported here so it is processed BEFORE globals.css and
// our theming overrides in globals.css can win the cascade (EVO-1270).
import '@xyflow/react/dist/style.css';
import './styles/globals.css';
import './i18n/config'; // Importar configuração do i18n
import App from './App.tsx';
import { initTheme } from './utils/themeUtils';
import { initGA4 } from './utils/ga4Utils';

// Inicialização do tema antes do React montar
initTheme();

// Inicialização do Google Analytics 4
initGA4();

// Splash screen removal - React vai substituir o conteúdo do #root automaticamente
// ao fazer mount, removendo o splash screen nativo do PWA

// ⚡ OTIMIZAÇÃO: StrictMode removido para evitar duplicação de requests
// Em desenvolvimento, StrictMode executa useEffect 2x para detectar problemas
const root = document.getElementById('root')!;
const splash = document.getElementById('app-splash');

if (splash) {
  // Pequeno atraso para garantir transição suave do splash para o app
  requestAnimationFrame(() => {
    createRoot(root).render(<App />);
  });
} else {
  createRoot(root).render(<App />);
}
