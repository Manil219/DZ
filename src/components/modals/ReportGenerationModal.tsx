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
import { Progress } from "@/components/ui/progress";
import { 
  FileText, Download, BarChart3, PieChart, LineChart, 
  Calendar, Filter, Settings, Plus, X, Save, Eye,
  Clock, Users, Database, Globe, Target, Zap
} from "lucide-react";
import { toast } from '@/hooks/use-toast';

interface ReportGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate?: (report: ReportConfig) => Promise<void>;
}

export interface ReportConfig {
  id?: string;
  name: string;
  description: string;
  type: 'analytics' | 'compliance' | 'performance' | 'custom';
  format: 'pdf' | 'excel' | 'csv' | 'json';
  template: string;
  filters: ReportFilter[];
  schedule?: ReportSchedule;
  recipients: string[];
  createdBy: string;
  createdAt: string;
}

interface ReportFilter {
  id: string;
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'between' | 'in';
  value: string | string[];
  enabled: boolean;
}

interface ReportSchedule {
  type: 'once' | 'daily' | 'weekly' | 'monthly';
  startDate: string;
  endDate?: string;
  time: string;
  timezone: string;
  enabled: boolean;
}

export function ReportGenerationModal({ isOpen, onClose, onGenerate }: ReportGenerationModalProps) {
  const [formData, setFormData] = useState<Partial<ReportConfig>>({
    name: '',
    description: '',
    type: 'analytics',
    format: 'pdf',
    template: 'default',
    filters: [],
    recipients: [],
    createdBy: 'current-user',
    createdAt: new Date().toISOString()
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [generationProgress, setGenerationProgress] = useState(0);

  const handleGenerate = async () => {
    if (!formData.name || !formData.description) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setGenerationProgress(0);

    // Simulation de la génération du rapport
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    try {
      if (onGenerate) {
        await onGenerate(formData as ReportConfig);
      }
      
      // Attendre que la progression soit terminée
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Succès",
        description: "Le rapport a été généré avec succès.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la génération du rapport.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setGenerationProgress(0);
      clearInterval(progressInterval);
    }
  };

  const addFilter = () => {
    const newFilter: ReportFilter = {
      id: `filter-${Date.now()}`,
      field: '',
      operator: 'equals',
      value: '',
      enabled: true
    };
    setFormData(prev => ({
      ...prev,
      filters: [...(prev.filters || []), newFilter]
    }));
  };

  const updateFilter = (index: number, field: keyof ReportFilter, value: any) => {
    setFormData(prev => ({
      ...prev,
      filters: prev.filters?.map((filter, i) => 
        i === index ? { ...filter, [field]: value } : filter
      )
    }));
  };

  const removeFilter = (index: number) => {
    setFormData(prev => ({
      ...prev,
      filters: prev.filters?.filter((_, i) => i !== index)
    }));
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      analytics: BarChart3,
      compliance: FileText,
      performance: Target,
      custom: Settings
    };
    const Icon = icons[type as keyof typeof icons];
    return Icon ? <Icon className="h-4 w-4" /> : <FileText className="h-4 w-4" />;
  };

  const getFormatIcon = (format: string) => {
    const icons = {
      pdf: FileText,
      excel: BarChart3,
      csv: Database,
      json: Globe
    };
    const Icon = icons[format as keyof typeof icons];
    return Icon ? <Icon className="h-4 w-4" /> : <FileText className="h-4 w-4" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Génération de Rapport
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="filters">Filtres</TabsTrigger>
            <TabsTrigger value="schedule">Planification</TabsTrigger>
            <TabsTrigger value="preview">Aperçu</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du rapport *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Rapport d'activité mensuel"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type de rapport</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="analytics">Analytique</SelectItem>
                    <SelectItem value="compliance">Conformité</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="custom">Personnalisé</SelectItem>
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
                placeholder="Décrivez le contenu et l'objectif de ce rapport"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="format">Format de sortie</Label>
                <Select value={formData.format} onValueChange={(value) => setFormData(prev => ({ ...prev, format: value as any }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="template">Template</Label>
                <Select value={formData.template} onValueChange={(value) => setFormData(prev => ({ ...prev, template: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Template par défaut</SelectItem>
                    <SelectItem value="executive">Template exécutif</SelectItem>
                    <SelectItem value="detailed">Template détaillé</SelectItem>
                    <SelectItem value="custom">Template personnalisé</SelectItem>
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

          <TabsContent value="filters" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Filtres de données</h3>
              <Button onClick={addFilter} size="sm" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Ajouter un filtre
              </Button>
            </div>

            <div className="space-y-4">
              {formData.filters?.map((filter, index) => (
                <Card key={filter.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Champ</Label>
                            <Select value={filter.field} onValueChange={(value) => updateFilter(index, 'field', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un champ" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="date">Date</SelectItem>
                                <SelectItem value="user">Utilisateur</SelectItem>
                                <SelectItem value="department">Département</SelectItem>
                                <SelectItem value="status">Statut</SelectItem>
                                <SelectItem value="type">Type</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Opérateur</Label>
                            <Select value={filter.operator} onValueChange={(value) => updateFilter(index, 'operator', value as any)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="equals">Égal à</SelectItem>
                                <SelectItem value="not_equals">Différent de</SelectItem>
                                <SelectItem value="contains">Contient</SelectItem>
                                <SelectItem value="greater_than">Supérieur à</SelectItem>
                                <SelectItem value="less_than">Inférieur à</SelectItem>
                                <SelectItem value="between">Entre</SelectItem>
                                <SelectItem value="in">Dans</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Valeur</Label>
                            <Input
                              value={filter.value as string}
                              onChange={(e) => updateFilter(index, 'value', e.target.value)}
                              placeholder="Ex: 2024-01-01"
                            />
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFilter(index)}
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
                        checked={filter.enabled}
                        onCheckedChange={(checked) => updateFilter(index, 'enabled', checked)}
                      />
                      <Label htmlFor={`enabled-${index}`}>Filtre actif</Label>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="schedule-enabled"
                  checked={formData.schedule?.enabled}
                  onCheckedChange={(checked) => setFormData(prev => ({
                    ...prev,
                    schedule: { ...prev.schedule!, enabled: checked }
                  }))}
                />
                <Label htmlFor="schedule-enabled">Planifier la génération automatique</Label>
              </div>

              {formData.schedule?.enabled && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Fréquence</Label>
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

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date de début</Label>
                      <Input
                        type="date"
                        value={formData.schedule?.startDate}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          schedule: { ...prev.schedule!, startDate: e.target.value }
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Date de fin (optionnel)</Label>
                      <Input
                        type="date"
                        value={formData.schedule?.endDate}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          schedule: { ...prev.schedule!, endDate: e.target.value }
                        }))}
                      />
                    </div>
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
              )}
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getTypeIcon(formData.type || 'analytics')}
                    Aperçu du rapport
                  </CardTitle>
                  <CardDescription>
                    Configuration actuelle du rapport à générer
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Nom</Label>
                      <p className="text-sm mt-1">{formData.name || 'Non défini'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Type</Label>
                      <p className="text-sm mt-1 capitalize">{formData.type?.replace('_', ' ') || 'Non défini'}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Description</Label>
                    <p className="text-sm mt-1">{formData.description || 'Non définie'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Format</Label>
                      <div className="flex items-center gap-2 mt-1">
                        {getFormatIcon(formData.format || 'pdf')}
                        <span className="text-sm uppercase">{formData.format || 'Non défini'}</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Template</Label>
                      <p className="text-sm mt-1 capitalize">{formData.template?.replace('_', ' ') || 'Non défini'}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Filtres actifs</Label>
                    <div className="mt-1">
                      {formData.filters?.filter(f => f.enabled).length ? (
                        <div className="space-y-1">
                          {formData.filters.filter(f => f.enabled).map((filter, index) => (
                            <Badge key={index} variant="outline" className="mr-1">
                              {filter.field} {filter.operator} {filter.value}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">Aucun filtre actif</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {loading && (
                <Card>
                  <CardHeader>
                    <CardTitle>Génération en cours...</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Progress value={generationProgress} className="w-full" />
                    <p className="text-sm text-muted-foreground mt-2">
                      {generationProgress}% - Génération du rapport...
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? "Génération..." : "Générer le rapport"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}