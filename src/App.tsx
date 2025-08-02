
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import { AdminPanel } from '@/components/admin/AdminPanel';
import { log } from '@/utils/securityLogger';

import { EnhancedSecurityProvider } from '@/components/security/EnhancedSecurityProvider';
import { GlobalNotificationManager } from '@/components/common/GlobalNotificationManager';

import { AIAutoFillGlobalManager } from '@/components/ai/AIAutoFillGlobalManager';


// Initialisation différée des handlers pour éviter les erreurs
let handlersInitialized = false;

// Composant ErrorBoundary pour capturer les erreurs
class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    log.error('ErrorBoundary a capturé une erreur:', { error: error.message, stack: error.stack }, 'ErrorBoundary');
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
          <h1>Quelque chose s'est mal passé</h1>
          <p>Une erreur inattendue s'est produite.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{ padding: '10px 20px', margin: '10px', cursor: 'pointer' }}
          >
            Recharger la page
          </button>
          <details style={{ marginTop: '20px', textAlign: 'left' }}>
            <summary>Détails techniques</summary>
            <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
              {this.state.error?.stack}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  // Initialiser les handlers universels et les données d'exemple au démarrage
  React.useEffect(() => {
    if (handlersInitialized) return;
    handlersInitialized = true;

    const initializeApp = async () => {
      try {
        // Importation différée pour éviter les erreurs au build
        const { initializeUniversalButtonHandlers } = await import('@/utils/universalButtonHandler');
        const { initializeGlobalToastSystem } = await import('@/utils/globalToastSystem');
        const { initializeSampleData } = await import('@/data/sampleData');
        const { useAppStore } = await import('@/stores/appStore');
        
        initializeUniversalButtonHandlers();
        initializeGlobalToastSystem();
        
        // Initialiser les données d'exemple seulement si le store est vide
        const store = useAppStore.getState();
        if (store.legalTexts.length === 0) {
          initializeSampleData();
        }

        // SYSTÈME RÉELLEMENT FONCTIONNEL - BRANCHE LYO
        setTimeout(async () => {
          try {
            const { realFunctionalSystem } = await import('@/utils/realFunctionalButtons');
            const { initializeFunctionalSystem } = await import('@/utils/functionalButtonSystem');
            const { installSpecializedHandlers } = await import('@/utils/specializedHandlers');
            
            realFunctionalSystem.initialize();
            initializeFunctionalSystem();
            installSpecializedHandlers();
            log.info('BRANCHE LYO: Tous les boutons et liens sont maintenant fonctionnels');
          } catch (error) {
            log.warn('Erreur lors de l\'initialisation des handlers avancés:', error);
          }
        }, 2000);
      } catch (error) {
        log.error('Erreur lors de l\'initialisation de l\'app:', error);
      }
    };

    initializeApp();
  }, []);

  return (
    <AppErrorBoundary>
      <EnhancedSecurityProvider>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/:section" element={<Index />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster />
            <AIAutoFillGlobalManager />
            <GlobalNotificationManager />
          </div>
        </BrowserRouter>
      </EnhancedSecurityProvider>
    </AppErrorBoundary>
  );
}

export default App;
