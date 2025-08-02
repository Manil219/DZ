import { log } from './securityLogger';

interface CacheConfig {
  maxSize: number;
  ttl: number;
  enableCompression: boolean;
  enableEncryption: boolean;
  enableOfflineSync: boolean;
}

interface CacheEntry {
  key: string;
  value: any;
  timestamp: number;
  ttl: number;
  size: number;
  compressed: boolean;
  encrypted: boolean;
  accessCount: number;
  lastAccessed: number;
}

export class IntelligentCacheManager {
  private static instance: IntelligentCacheManager;
  private config: CacheConfig;
  private cache: Map<string, CacheEntry> = new Map();
  private offlineQueue: Array<{ action: string; data: any; timestamp: number }> = [];
  private syncInProgress: boolean = false;

  static getInstance(): IntelligentCacheManager {
    if (!IntelligentCacheManager.instance) {
      IntelligentCacheManager.instance = new IntelligentCacheManager();
    }
    return IntelligentCacheManager.instance;
  }

  constructor() {
    this.config = {
      maxSize: 50 * 1024 * 1024, // 50MB
      ttl: 24 * 60 * 60 * 1000, // 24 heures
      enableCompression: true,
      enableEncryption: true,
      enableOfflineSync: true
    };

    this.initializeCache();
  }

  private initializeCache() {
    log.info('Initialisation du système de cache intelligent', {}, 'IntelligentCacheManager');
    
    // Charger le cache depuis localStorage
    this.loadFromStorage();
    
    // Nettoyer le cache expiré
    this.cleanupExpiredEntries();
    
    // Initialiser la synchronisation hors ligne
    if (this.config.enableOfflineSync) {
      this.initializeOfflineSync();
    }
  }

  private loadFromStorage() {
    try {
      const cached = localStorage.getItem('intelligent-cache');
      if (cached) {
        const data = JSON.parse(cached);
        this.cache = new Map(data);
        log.info('Cache chargé depuis le stockage', { entries: this.cache.size }, 'IntelligentCacheManager');
      }
    } catch (error) {
      log.warn('Erreur lors du chargement du cache', { error }, 'IntelligentCacheManager');
    }
  }

  private saveToStorage() {
    try {
      const data = Array.from(this.cache.entries());
      localStorage.setItem('intelligent-cache', JSON.stringify(data));
    } catch (error) {
      log.warn('Erreur lors de la sauvegarde du cache', { error }, 'IntelligentCacheManager');
    }
  }

  private async compressData(data: any): Promise<string> {
    if (!this.config.enableCompression) return JSON.stringify(data);
    
    // Simulation de compression (en production, utiliser LZ-string ou pako)
    const jsonString = JSON.stringify(data);
    return btoa(jsonString);
  }

  private async decompressData(compressedData: string): Promise<any> {
    if (!this.config.enableCompression) return JSON.parse(compressedData);
    
    // Simulation de décompression
    const jsonString = atob(compressedData);
    return JSON.parse(jsonString);
  }

  private async encryptData(data: string): Promise<string> {
    if (!this.config.enableEncryption) return data;
    
    // Simulation de chiffrement (en production, utiliser Web Crypto API)
    return btoa(data);
  }

  private async decryptData(encryptedData: string): Promise<string> {
    if (!this.config.enableEncryption) return encryptedData;
    
    // Simulation de déchiffrement
    return atob(encryptedData);
  }

  private calculateSize(data: any): number {
    return new Blob([JSON.stringify(data)]).size;
  }

  private async evictLeastUsed() {
    const entries = Array.from(this.cache.entries());
    entries.sort((a, b) => {
      // Priorité: accessCount, puis lastAccessed
      if (a[1].accessCount !== b[1].accessCount) {
        return a[1].accessCount - b[1].accessCount;
      }
      return a[1].lastAccessed - b[1].lastAccessed;
    });

    // Supprimer 20% des entrées les moins utilisées
    const toRemove = Math.ceil(entries.length * 0.2);
    for (let i = 0; i < toRemove; i++) {
      this.cache.delete(entries[i][0]);
    }

    log.info('Éviction des entrées les moins utilisées', { removed: toRemove }, 'IntelligentCacheManager');
  }

  private cleanupExpiredEntries() {
    const now = Date.now();
    let expiredCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        expiredCount++;
      }
    }

    if (expiredCount > 0) {
      log.info('Nettoyage des entrées expirées', { expiredCount }, 'IntelligentCacheManager');
    }
  }

  private initializeOfflineSync() {
    // Écouter les changements de connectivité
    window.addEventListener('online', () => {
      this.syncOfflineQueue();
    });

    // Vérifier la connectivité périodiquement
    setInterval(() => {
      if (navigator.onLine && this.offlineQueue.length > 0) {
        this.syncOfflineQueue();
      }
    }, 30000); // Toutes les 30 secondes
  }

  private async syncOfflineQueue() {
    if (this.syncInProgress || this.offlineQueue.length === 0) return;

    this.syncInProgress = true;
    log.info('Début de la synchronisation hors ligne', { queueSize: this.offlineQueue.length }, 'IntelligentCacheManager');

    try {
      for (const item of this.offlineQueue) {
        await this.processOfflineAction(item);
      }
      
      this.offlineQueue = [];
      log.info('Synchronisation hors ligne terminée', {}, 'IntelligentCacheManager');
    } catch (error) {
      log.error('Erreur lors de la synchronisation hors ligne', { error }, 'IntelligentCacheManager');
    } finally {
      this.syncInProgress = false;
    }
  }

  private async processOfflineAction(item: { action: string; data: any; timestamp: number }) {
    // Traiter les actions en attente
    switch (item.action) {
      case 'SET':
        await this.set(item.data.key, item.data.value, item.data.options);
        break;
      case 'DELETE':
        await this.delete(item.data.key);
        break;
      case 'CLEAR':
        await this.clear();
        break;
    }
  }

  // Méthodes publiques

  public async set(key: string, value: any, options: { ttl?: number; compress?: boolean; encrypt?: boolean } = {}): Promise<void> {
    const now = Date.now();
    const ttl = options.ttl || this.config.ttl;
    const shouldCompress = options.compress !== undefined ? options.compress : this.config.enableCompression;
    const shouldEncrypt = options.encrypt !== undefined ? options.encrypt : this.config.enableEncryption;

    try {
      // Compresser et chiffrer les données
      let processedValue = value;
      let compressed = false;
      let encrypted = false;

      if (shouldCompress) {
        processedValue = await this.compressData(value);
        compressed = true;
      }

      if (shouldEncrypt) {
        processedValue = await this.encryptData(processedValue);
        encrypted = true;
      }

      const size = this.calculateSize(processedValue);
      const entry: CacheEntry = {
        key,
        value: processedValue,
        timestamp: now,
        ttl,
        size,
        compressed,
        encrypted,
        accessCount: 0,
        lastAccessed: now
      };

      // Vérifier la taille du cache
      const currentSize = Array.from(this.cache.values()).reduce((sum, e) => sum + e.size, 0);
      if (currentSize + size > this.config.maxSize) {
        await this.evictLeastUsed();
      }

      this.cache.set(key, entry);
      this.saveToStorage();

      log.info('Entrée ajoutée au cache', { key, size, compressed, encrypted }, 'IntelligentCacheManager');
    } catch (error) {
      log.error('Erreur lors de l\'ajout au cache', { key, error }, 'IntelligentCacheManager');
      throw error;
    }
  }

  public async get(key: string): Promise<any | null> {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    
    // Vérifier l'expiration
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.saveToStorage();
      return null;
    }

    try {
      // Mettre à jour les statistiques d'accès
      entry.accessCount++;
      entry.lastAccessed = now;

      let value = entry.value;

      // Déchiffrer et décompresser si nécessaire
      if (entry.encrypted) {
        value = await this.decryptData(value);
      }

      if (entry.compressed) {
        value = await this.decompressData(value);
      }

      this.saveToStorage();
      return value;
    } catch (error) {
      log.error('Erreur lors de la récupération du cache', { key, error }, 'IntelligentCacheManager');
      return null;
    }
  }

  public async delete(key: string): Promise<boolean> {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.saveToStorage();
      log.info('Entrée supprimée du cache', { key }, 'IntelligentCacheManager');
    }
    return deleted;
  }

  public async clear(): Promise<void> {
    this.cache.clear();
    this.saveToStorage();
    log.info('Cache vidé', {}, 'IntelligentCacheManager');
  }

  public async has(key: string): Promise<boolean> {
    const entry = this.cache.get(key);
    if (!entry) return false;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.saveToStorage();
      return false;
    }

    return true;
  }

  public async keys(): Promise<string[]> {
    this.cleanupExpiredEntries();
    return Array.from(this.cache.keys());
  }

  public async size(): Promise<number> {
    this.cleanupExpiredEntries();
    return this.cache.size;
  }

  public async getStats(): Promise<{
    totalEntries: number;
    totalSize: number;
    averageAccessCount: number;
    oldestEntry: number;
    newestEntry: number;
    compressionRatio: number;
    encryptionRatio: number;
  }> {
    const entries = Array.from(this.cache.values());
    const totalSize = entries.reduce((sum, e) => sum + e.size, 0);
    const averageAccessCount = entries.reduce((sum, e) => sum + e.accessCount, 0) / entries.length || 0;
    const timestamps = entries.map(e => e.timestamp);
    const compressionRatio = entries.filter(e => e.compressed).length / entries.length || 0;
    const encryptionRatio = entries.filter(e => e.encrypted).length / entries.length || 0;

    return {
      totalEntries: entries.length,
      totalSize,
      averageAccessCount,
      oldestEntry: Math.min(...timestamps),
      newestEntry: Math.max(...timestamps),
      compressionRatio,
      encryptionRatio
    };
  }

  public async addToOfflineQueue(action: string, data: any): Promise<void> {
    this.offlineQueue.push({
      action,
      data,
      timestamp: Date.now()
    });

    log.info('Action ajoutée à la file d\'attente hors ligne', { action, queueSize: this.offlineQueue.length }, 'IntelligentCacheManager');
  }

  public getOfflineQueueSize(): number {
    return this.offlineQueue.length;
  }

  public async preload(keys: string[]): Promise<void> {
    log.info('Préchargement du cache', { keysCount: keys.length }, 'IntelligentCacheManager');
    
    // Simulation de préchargement
    for (const key of keys) {
      if (!(await this.has(key))) {
        // Charger depuis la source si disponible
        await this.set(key, { preloaded: true, timestamp: Date.now() });
      }
    }
  }

  public async invalidatePattern(pattern: RegExp): Promise<number> {
    let invalidatedCount = 0;
    
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.cache.delete(key);
        invalidatedCount++;
      }
    }

    if (invalidatedCount > 0) {
      this.saveToStorage();
      log.info('Invalidation par pattern', { pattern: pattern.source, invalidatedCount }, 'IntelligentCacheManager');
    }

    return invalidatedCount;
  }
}

export const intelligentCache = IntelligentCacheManager.getInstance();