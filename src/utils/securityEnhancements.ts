import { log } from './securityLogger';

// Interface pour les paramètres de sécurité
interface SecurityConfig {
  enableCSP: boolean;
  enableXSSProtection: boolean;
  enableCSRFProtection: boolean;
  enableRateLimiting: boolean;
  enableInputValidation: boolean;
  enableOutputEncoding: boolean;
  maxRequestSize: number;
  allowedOrigins: string[];
  blockedPatterns: RegExp[];
}

// Classe pour les améliorations de sécurité
export class SecurityEnhancements {
  private static instance: SecurityEnhancements;
  private config: SecurityConfig;
  private blockedIPs: Set<string> = new Set();
  private rateLimitMap: Map<string, { count: number; resetTime: number }> = new Map();

  static getInstance(): SecurityEnhancements {
    if (!SecurityEnhancements.instance) {
      SecurityEnhancements.instance = new SecurityEnhancements();
    }
    return SecurityEnhancements.instance;
  }

  constructor() {
    this.config = {
      enableCSP: true,
      enableXSSProtection: true,
      enableCSRFProtection: true,
      enableRateLimiting: true,
      enableInputValidation: true,
      enableOutputEncoding: true,
      maxRequestSize: 10 * 1024 * 1024, // 10MB
      allowedOrigins: ['localhost', '127.0.0.1'],
      blockedPatterns: [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /eval\s*\(/gi,
        /expression\s*\(/gi
      ]
    };

    this.initializeSecurity();
  }

  private initializeSecurity() {
    log.info('Initialisation des améliorations de sécurité', {}, 'SecurityEnhancements');
    
    // Appliquer les headers de sécurité
    this.applySecurityHeaders();
    
    // Initialiser la protection XSS
    this.initializeXSSProtection();
    
    // Initialiser la protection CSRF
    this.initializeCSRFProtection();
    
    // Initialiser la validation d'entrée
    this.initializeInputValidation();
    
    // Initialiser l'encodage de sortie
    this.initializeOutputEncoding();
  }

  private applySecurityHeaders() {
    if (typeof window !== 'undefined') {
      // Headers de sécurité pour le navigateur
      const securityHeaders = {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
      };

      // Appliquer les headers via meta tags
      Object.entries(securityHeaders).forEach(([key, value]) => {
        const meta = document.createElement('meta');
        meta.setAttribute('http-equiv', key);
        meta.setAttribute('content', value);
        document.head.appendChild(meta);
      });

      log.info('Headers de sécurité appliqués', { headers: securityHeaders }, 'SecurityEnhancements');
    }
  }

  private initializeXSSProtection() {
    if (!this.config.enableXSSProtection) return;

    // Protection XSS côté client
    const sanitizeInput = (input: string): string => {
      if (typeof input !== 'string') return input;
      
      return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
    };

    // Intercepter les modifications du DOM
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent;
            if (text && this.containsXSS(text)) {
              log.warn('Tentative XSS détectée', { text }, 'SecurityEnhancements');
              node.textContent = sanitizeInput(text);
            }
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    log.info('Protection XSS initialisée', {}, 'SecurityEnhancements');
  }

  private initializeCSRFProtection() {
    if (!this.config.enableCSRFProtection) return;

    // Générer un token CSRF
    const generateCSRFToken = (): string => {
      const array = new Uint8Array(32);
      crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    };

    // Stocker le token
    const token = generateCSRFToken();
    sessionStorage.setItem('csrf-token', token);

    // Intercepter les requêtes AJAX
    const originalFetch = window.fetch;
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      if (init && init.method && init.method !== 'GET' && init.method !== 'HEAD') {
        // Ajouter le token CSRF
        const csrfToken = sessionStorage.getItem('csrf-token');
        if (csrfToken) {
          init.headers = {
            ...init.headers,
            'X-CSRF-Token': csrfToken
          };
        }
      }
      return originalFetch(input, init);
    };

    log.info('Protection CSRF initialisée', {}, 'SecurityEnhancements');
  }

  private initializeInputValidation() {
    if (!this.config.enableInputValidation) return;

    // Validation des entrées utilisateur
    const validateInput = (input: any, type: string): boolean => {
      if (typeof input !== 'string') return true;

      // Vérifier les patterns bloqués
      for (const pattern of this.config.blockedPatterns) {
        if (pattern.test(input)) {
          log.warn('Entrée malveillante détectée', { input, pattern: pattern.source }, 'SecurityEnhancements');
          return false;
        }
      }

      // Validation spécifique par type
      switch (type) {
        case 'email':
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
        case 'url':
          try {
            new URL(input);
            return true;
          } catch {
            return false;
          }
        case 'phone':
          return /^[\+]?[1-9][\d]{0,15}$/.test(input.replace(/\s/g, ''));
        case 'number':
          return !isNaN(Number(input)) && isFinite(Number(input));
        default:
          return input.length <= 10000; // Limite de taille par défaut
      }
    };

    // Intercepter les événements de saisie
    document.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement;
      if (target && target.value) {
        const type = target.type || 'text';
        if (!validateInput(target.value, type)) {
          log.warn('Validation d\'entrée échouée', { 
            value: target.value, 
            type,
            element: target.tagName 
          }, 'SecurityEnhancements');
          
          // Nettoyer l'entrée
          target.value = this.sanitizeInput(target.value);
        }
      }
    });

    log.info('Validation d\'entrée initialisée', {}, 'SecurityEnhancements');
  }

  private initializeOutputEncoding() {
    if (!this.config.enableOutputEncoding) return;

    // Encodage de sortie sécurisé
    this.sanitizeOutput = (output: string): string => {
      if (typeof output !== 'string') return output;
      
      return output
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
    };

    log.info('Encodage de sortie initialisé', {}, 'SecurityEnhancements');
  }

  // Méthodes publiques

  public sanitizeInput(input: string): string {
    if (typeof input !== 'string') return input;
    
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/eval\s*\(/gi, '')
      .replace(/expression\s*\(/gi, '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

  public sanitizeOutput(output: string): string {
    if (typeof output !== 'string') return output;
    
    return output
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

  public validateInput(input: any, type: string = 'text'): boolean {
    if (typeof input !== 'string') return true;

    // Vérifier les patterns bloqués
    for (const pattern of this.config.blockedPatterns) {
      if (pattern.test(input)) {
        log.warn('Entrée malveillante détectée', { input, pattern: pattern.source }, 'SecurityEnhancements');
        return false;
      }
    }

    // Validation spécifique par type
    switch (type) {
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
      case 'url':
        try {
          new URL(input);
          return true;
        } catch {
          return false;
        }
      case 'phone':
        return /^[\+]?[1-9][\d]{0,15}$/.test(input.replace(/\s/g, ''));
      case 'number':
        return !isNaN(Number(input)) && isFinite(Number(input));
      case 'alphanumeric':
        return /^[a-zA-Z0-9\s]+$/.test(input);
      case 'filename':
        return /^[a-zA-Z0-9._-]+$/.test(input);
      default:
        return input.length <= 10000;
    }
  }

  public checkRateLimit(identifier: string, limit: number = 100, windowMs: number = 60000): boolean {
    if (!this.config.enableRateLimiting) return true;

    const now = Date.now();
    const record = this.rateLimitMap.get(identifier);

    if (!record || now > record.resetTime) {
      // Nouvelle fenêtre de temps
      this.rateLimitMap.set(identifier, {
        count: 1,
        resetTime: now + windowMs
      });
      return true;
    }

    if (record.count >= limit) {
      log.warn('Limite de taux dépassée', { identifier, limit }, 'SecurityEnhancements');
      return false;
    }

    record.count++;
    return true;
  }

  public blockIP(ip: string): void {
    this.blockedIPs.add(ip);
    log.warn('IP bloquée', { ip }, 'SecurityEnhancements');
  }

  public isIPBlocked(ip: string): boolean {
    return this.blockedIPs.has(ip);
  }

  public containsXSS(input: string): boolean {
    if (typeof input !== 'string') return false;
    
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /eval\s*\(/gi,
      /expression\s*\(/gi,
      /vbscript:/gi,
      /data:/gi
    ];

    return xssPatterns.some(pattern => pattern.test(input));
  }

  public generateSecureToken(length: number = 32): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  public hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // Simulation d'un hash sécurisé (en production, utiliser bcrypt ou argon2)
      const encoder = new TextEncoder();
      const data = encoder.encode(password + 'salt');
      
      crypto.subtle.digest('SHA-256', data)
        .then(hash => {
          const hashArray = Array.from(new Uint8Array(hash));
          const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
          resolve(hashHex);
        })
        .catch(reject);
    });
  }

  public encryptData(data: string, key: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const encoder = new TextEncoder();
      const keyData = encoder.encode(key);
      const dataBuffer = encoder.encode(data);

      crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'AES-GCM' },
        false,
        ['encrypt']
      )
      .then(cryptoKey => {
        const iv = crypto.getRandomValues(new Uint8Array(12));
        return crypto.subtle.encrypt(
          { name: 'AES-GCM', iv },
          cryptoKey,
          dataBuffer
        );
      })
      .then(encrypted => {
        const encryptedArray = new Uint8Array(encrypted);
        const result = Array.from(encryptedArray, byte => byte.toString(16).padStart(2, '0')).join('');
        resolve(result);
      })
      .catch(reject);
    });
  }

  public getSecurityReport() {
    return {
      config: this.config,
      blockedIPsCount: this.blockedIPs.size,
      rateLimitMapSize: this.rateLimitMap.size,
      recommendations: this.getSecurityRecommendations()
    };
  }

  public getSecurityRecommendations() {
    return [
      {
        category: 'Validation',
        priority: 'high',
        title: 'Validation stricte des entrées',
        description: 'Implémenter une validation stricte pour tous les champs de saisie'
      },
      {
        category: 'Encodage',
        priority: 'high',
        title: 'Encodage de sortie',
        description: 'Encoder toutes les sorties pour prévenir les attaques XSS'
      },
      {
        category: 'Authentification',
        priority: 'high',
        title: 'Authentification à deux facteurs',
        description: 'Implémenter l\'authentification à deux facteurs pour les comptes sensibles'
      },
      {
        category: 'Chiffrement',
        priority: 'medium',
        title: 'Chiffrement des données sensibles',
        description: 'Chiffrer les données sensibles en transit et au repos'
      },
      {
        category: 'Audit',
        priority: 'medium',
        title: 'Journalisation de sécurité',
        description: 'Implémenter un système de journalisation pour les événements de sécurité'
      }
    ];
  }
}

// Export de l'instance singleton
export const securityEnhancements = SecurityEnhancements.getInstance();