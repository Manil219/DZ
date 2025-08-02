import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Settings, Cog, Wrench, Tool, Plus, X, Save, Eye,
  Clock, Users, Database, Globe, Target, Zap, FileText,
  BarChart3, Shield, Bell, MessageSquare, Calendar
} from "lucide-react";
import { toast } from '@/hooks/use-toast';

interface FunctionalModalsProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'settings' | 'configuration' | 'tools' | 'utilities';
  onSave?: (data: any) => Promise<void>;
}

export interface FunctionalConfig {
  id?: string;
  name: string;
  description: string;
  type: string;
  settings: Record<string, any>;
  enabled: boolean;
  createdBy: string;
  createdAt: string;
}

export function FunctionalModals({ isOpen, onClose, type, onSave }: FunctionalModalsProps) {
  const [formData, setFormData] = useState<Partial<FunctionalConfig>>({
    name: '',
    description: '',
    type: type,
    settings: {},
    enabled: true,
    createdBy: 'current-user',
    createdAt: new Date().toISOString()
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const handleSave = async () => {
    if (!formData.name || !formData.description) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (onSave) {
        await onSave(formData);
      }
      toast({
        title: "Succès",
        description: "La configuration a été sauvegardée avec succès.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la sauvegarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      settings: Settings,
      configuration: Cog,
      tools: Wrench,
      utilities: Tool
    };
    const Icon = icons[type as keyof typeof icons];
    return Icon ? <Icon className="h-4 w-4" /> : <Settings className="h-4 w-4" />;
  };

  const getTypeTitle = (type: string) => {
    const titles = {
      settings: 'Paramètres',
      configuration: 'Configuration',
      tools: 'Outils',
      utilities: 'Utilitaires'
    };
    return titles[type as keyof typeof titles] || 'Fonctionnalité';
  };

  const renderSettingsContent = () => {
    switch (type) {
      case 'settings':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Thème</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un thème" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Clair</SelectItem>
                    <SelectItem value="dark">Sombre</SelectItem>
                    <SelectItem value="auto">Automatique</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Langue</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une langue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notifications</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="email-notifications" />
                  <Label htmlFor="email-notifications">Notifications par email</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="push-notifications" />
                  <Label htmlFor="push-notifications">Notifications push</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="sms-notifications" />
                  <Label htmlFor="sms-notifications">Notifications SMS</Label>
                </div>
              </div>
            </div>
          </div>
        );

      case 'configuration':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Mode de fonctionnement</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="production">Production</SelectItem>
                    <SelectItem value="development">Développement</SelectItem>
                    <SelectItem value="testing">Test</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Niveau de log</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="error">Erreur</SelectItem>
                    <SelectItem value="warning">Avertissement</SelectItem>
                    <SelectItem value="info">Information</SelectItem>
                    <SelectItem value="debug">Debug</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Performance</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="cache-enabled" />
                  <Label htmlFor="cache-enabled">Activer le cache</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="compression-enabled" />
                  <Label htmlFor="compression-enabled">Activer la compression</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="optimization-enabled" />
                  <Label htmlFor="optimization-enabled">Optimisations automatiques</Label>
                </div>
              </div>
            </div>
          </div>
        );

      case 'tools':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Outil principal</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un outil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="analyzer">Analyseur de données</SelectItem>
                    <SelectItem value="validator">Validateur</SelectItem>
                    <SelectItem value="converter">Convertisseur</SelectItem>
                    <SelectItem value="generator">Générateur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Mode d'exécution</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manuel</SelectItem>
                    <SelectItem value="automatic">Automatique</SelectItem>
                    <SelectItem value="scheduled">Planifié</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Options avancées</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="batch-processing" />
                  <Label htmlFor="batch-processing">Traitement par lot</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="parallel-processing" />
                  <Label htmlFor="parallel-processing">Traitement parallèle</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="error-recovery" />
                  <Label htmlFor="error-recovery">Récupération d'erreurs</Label>
                </div>
              </div>
            </div>
          </div>
        );

      case 'utilities':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Utilitaire</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un utilitaire" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="backup">Sauvegarde</SelectItem>
                    <SelectItem value="cleanup">Nettoyage</SelectItem>
                    <SelectItem value="migration">Migration</SelectItem>
                    <SelectItem value="sync">Synchronisation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priorité</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une priorité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Faible</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="high">Élevée</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Options</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="auto-run" />
                  <Label htmlFor="auto-run">Exécution automatique</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="notify-completion" />
                  <Label htmlFor="notify-completion">Notification de fin</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="log-activity" />
                  <Label htmlFor="log-activity">Journaliser l'activité</Label>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Configuration générique pour {getTypeTitle(type)}
            </p>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getTypeIcon(type)}
            {getTypeTitle(type)}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
            <TabsTrigger value="advanced">Avancé</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder={`Nom de la ${getTypeTitle(type).toLowerCase()}`}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="enabled">Statut</Label>
                <Select 
                  value={formData.enabled ? 'enabled' : 'disabled'} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, enabled: value === 'enabled' }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enabled">Activé</SelectItem>
                    <SelectItem value="disabled">Désactivé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder={`Description de la ${getTypeTitle(type).toLowerCase()}`}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Type</Label>
              <div className="flex items-center gap-2">
                {getTypeIcon(type)}
                <span className="capitalize">{getTypeTitle(type)}</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            {renderSettingsContent()}
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Options avancées</CardTitle>
                  <CardDescription>
                    Paramètres techniques et de débogage
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Version</Label>
                      <Input placeholder="1.0.0" />
                    </div>
                    <div className="space-y-2">
                      <Label>Environnement</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un environnement" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="production">Production</SelectItem>
                          <SelectItem value="staging">Staging</SelectItem>
                          <SelectItem value="development">Développement</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Configuration JSON</Label>
                    <Textarea
                      placeholder='{"key": "value"}'
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Options de débogage</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="debug-mode" />
                        <Label htmlFor="debug-mode">Mode debug</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="verbose-logging" />
                        <Label htmlFor="verbose-logging">Logging verbeux</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="performance-monitoring" />
                        <Label htmlFor="performance-monitoring">Monitoring des performances</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Sauvegarde..." : "Sauvegarder"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}