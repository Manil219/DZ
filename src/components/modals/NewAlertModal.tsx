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
  Bell, AlertTriangle, Clock, Users, Settings, 
  CheckCircle, XCircle, Plus, Save, X, Calendar,
  Mail, MessageSquare, Smartphone, Globe
} from "lucide-react";
import { toast } from '@/hooks/use-toast';

interface NewAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (alert: Alert) => Promise<void>;
}

export interface Alert {
  id?: string;
  title: string;
  description: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'critical';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'active' | 'inactive' | 'draft';
  channels: AlertChannel[];
  recipients: string[];
  schedule: AlertSchedule;
  conditions: AlertCondition[];
  createdBy: string;
  createdAt: string;
}

interface AlertChannel {
  id: string;
  type: 'email' | 'sms' | 'push' | 'webhook' | 'slack';
  enabled: boolean;
  config: Record<string, any>;
}

interface AlertSchedule {
  type: 'immediate' | 'scheduled' | 'recurring';
  startDate?: string;
  endDate?: string;
  frequency?: 'once' | 'daily' | 'weekly' | 'monthly';
  time?: string;
  timezone: string;
}

interface AlertCondition {
  id: string;
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value: string;
  enabled: boolean;
}

export function NewAlertModal({ isOpen, onClose, onSave }: NewAlertModalProps) {
  const [formData, setFormData] = useState<Partial<Alert>>({
    title: '',
    description: '',
    type: 'info',
    priority: 'medium',
    status: 'draft',
    channels: [
      { id: 'email', type: 'email', enabled: true, config: {} },
      { id: 'push', type: 'push', enabled: false, config: {} }
    ],
    recipients: [],
    schedule: {
      type: 'immediate',
      timezone: 'Europe/Paris'
    },
    conditions: [],
    createdBy: 'current-user',
    createdAt: new Date().toISOString()
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const handleSave = async () => {
    if (!formData.title || !formData.description) {
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
        await onSave(formData as Alert);
      }
      toast({
        title: "Succès",
        description: "L'alerte a été créée avec succès.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la création de l'alerte.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addCondition = () => {
    const newCondition: AlertCondition = {
      id: `condition-${Date.now()}`,
      field: '',
      operator: 'equals',
      value: '',
      enabled: true
    };
    setFormData(prev => ({
      ...prev,
      conditions: [...(prev.conditions || []), newCondition]
    }));
  };

  const updateCondition = (index: number, field: keyof AlertCondition, value: any) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions?.map((condition, i) => 
        i === index ? { ...condition, [field]: value } : condition
      )
    }));
  };

  const removeCondition = (index: number) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions?.filter((_, i) => i !== index)
    }));
  };

  const toggleChannel = (channelId: string) => {
    setFormData(prev => ({
      ...prev,
      channels: prev.channels?.map(channel =>
        channel.id === channelId ? { ...channel, enabled: !channel.enabled } : channel
      )
    }));
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      info: Bell,
      warning: AlertTriangle,
      error: XCircle,
      success: CheckCircle,
      critical: AlertTriangle
    };
    const Icon = icons[type as keyof typeof icons];
    return Icon ? <Icon className="h-4 w-4" /> : <Bell className="h-4 w-4" />;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      info: 'bg-blue-100 text-blue-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
      success: 'bg-green-100 text-green-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[type as keyof typeof colors] || colors.info;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Nouvelle Alerte
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="channels">Canaux</TabsTrigger>
            <TabsTrigger value="conditions">Conditions</TabsTrigger>
            <TabsTrigger value="schedule">Planification</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre de l'alerte *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ex: Nouvelle procédure disponible"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type d'alerte</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Information</SelectItem>
                    <SelectItem value="warning">Avertissement</SelectItem>
                    <SelectItem value="error">Erreur</SelectItem>
                    <SelectItem value="success">Succès</SelectItem>
                    <SelectItem value="critical">Critique</SelectItem>
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
                placeholder="Décrivez le contenu de l'alerte et son objectif"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priorité</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as any }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Faible</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="high">Élevée</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Destinataires</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Utilisateurs</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner les utilisateurs" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les utilisateurs</SelectItem>
                      <SelectItem value="admins">Administrateurs uniquement</SelectItem>
                      <SelectItem value="custom">Utilisateurs spécifiques</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Groupes</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner les groupes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Aucun groupe</SelectItem>
                      <SelectItem value="all">Tous les groupes</SelectItem>
                      <SelectItem value="custom">Groupes spécifiques</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="channels" className="space-y-4">
            <div className="space-y-4">
              {formData.channels?.map((channel) => (
                <Card key={channel.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {channel.type === 'email' && <Mail className="h-4 w-4" />}
                          {channel.type === 'sms' && <Smartphone className="h-4 w-4" />}
                          {channel.type === 'push' && <Bell className="h-4 w-4" />}
                          {channel.type === 'webhook' && <Globe className="h-4 w-4" />}
                          {channel.type === 'slack' && <MessageSquare className="h-4 w-4" />}
                          <span className="font-medium capitalize">{channel.type}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={channel.enabled}
                          onCheckedChange={() => toggleChannel(channel.id)}
                        />
                        <Label>Activer</Label>
                      </div>
                    </div>
                  </CardHeader>
                  {channel.enabled && (
                    <CardContent className="space-y-4">
                      {channel.type === 'email' && (
                        <div className="space-y-2">
                          <Label>Template d'email</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un template" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="default">Template par défaut</SelectItem>
                              <SelectItem value="custom">Template personnalisé</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      {channel.type === 'webhook' && (
                        <div className="space-y-2">
                          <Label>URL du webhook</Label>
                          <Input placeholder="https://api.example.com/webhook" />
                        </div>
                      )}
                      {channel.type === 'slack' && (
                        <div className="space-y-2">
                          <Label>Canal Slack</Label>
                          <Input placeholder="#general" />
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="conditions" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Conditions de déclenchement</h3>
              <Button onClick={addCondition} size="sm" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Ajouter une condition
              </Button>
            </div>

            <div className="space-y-4">
              {formData.conditions?.map((condition, index) => (
                <Card key={condition.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Champ</Label>
                            <Input
                              value={condition.field}
                              onChange={(e) => updateCondition(index, 'field', e.target.value)}
                              placeholder="Ex: user.role"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Opérateur</Label>
                            <Select value={condition.operator} onValueChange={(value) => updateCondition(index, 'operator', value as any)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="equals">Égal à</SelectItem>
                                <SelectItem value="not_equals">Différent de</SelectItem>
                                <SelectItem value="contains">Contient</SelectItem>
                                <SelectItem value="greater_than">Supérieur à</SelectItem>
                                <SelectItem value="less_than">Inférieur à</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Valeur</Label>
                            <Input
                              value={condition.value}
                              onChange={(e) => updateCondition(index, 'value', e.target.value)}
                              placeholder="Ex: admin"
                            />
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCondition(index)}
                        className="text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`enabled-${index}`}
                        checked={condition.enabled}
                        onCheckedChange={(checked) => updateCondition(index, 'enabled', checked)}
                      />
                      <Label htmlFor={`enabled-${index}`}>Condition active</Label>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type de planification</Label>
                <Select 
                  value={formData.schedule?.type} 
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    schedule: { ...prev.schedule!, type: value as any }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immédiat</SelectItem>
                    <SelectItem value="scheduled">Planifié</SelectItem>
                    <SelectItem value="recurring">Récurrent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Fuseau horaire</Label>
                <Select 
                  value={formData.schedule?.timezone} 
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    schedule: { ...prev.schedule!, timezone: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/New_York">America/New_York</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.schedule?.type === 'scheduled' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date de début</Label>
                  <Input
                    type="datetime-local"
                    value={formData.schedule?.startDate}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      schedule: { ...prev.schedule!, startDate: e.target.value }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date de fin</Label>
                  <Input
                    type="datetime-local"
                    value={formData.schedule?.endDate}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      schedule: { ...prev.schedule!, endDate: e.target.value }
                    }))}
                  />
                </div>
              </div>
            )}

            {formData.schedule?.type === 'recurring' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fréquence</Label>
                  <Select 
                    value={formData.schedule?.frequency} 
                    onValueChange={(value) => setFormData(prev => ({ 
                      ...prev, 
                      schedule: { ...prev.schedule!, frequency: value as any }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="once">Une fois</SelectItem>
                      <SelectItem value="daily">Quotidien</SelectItem>
                      <SelectItem value="weekly">Hebdomadaire</SelectItem>
                      <SelectItem value="monthly">Mensuel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Heure</Label>
                  <Input
                    type="time"
                    value={formData.schedule?.time}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      schedule: { ...prev.schedule!, time: e.target.value }
                    }))}
                  />
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Création..." : "Créer l'alerte"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}