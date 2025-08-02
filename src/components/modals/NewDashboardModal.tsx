import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, Plus, X, Save, Eye, Settings
} from "lucide-react";
import { toast } from '@/hooks/use-toast';

interface NewDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (dashboard: Dashboard) => Promise<void>;
}

export interface Dashboard {
  id?: string;
  name: string;
  description: string;
  type: 'analytics' | 'monitoring' | 'reporting' | 'custom';
  widgets: string[];
  layout: string;
  createdBy: string;
  createdAt: string;
}

export function NewDashboardModal({ isOpen, onClose, onSave }: NewDashboardModalProps) {
  const [formData, setFormData] = useState<Partial<Dashboard>>({
    name: '',
    description: '',
    type: 'analytics',
    widgets: [],
    layout: 'grid',
    createdBy: 'current-user',
    createdAt: new Date().toISOString()
  });
  const [loading, setLoading] = useState(false);

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
        await onSave(formData as Dashboard);
      }
      toast({
        title: "Succès",
        description: "Le tableau de bord a été créé avec succès.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la création.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Nouveau Tableau de Bord
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="widgets">Widgets</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nom du tableau de bord"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="analytics">Analytique</SelectItem>
                    <SelectItem value="monitoring">Monitoring</SelectItem>
                    <SelectItem value="reporting">Rapport</SelectItem>
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
                placeholder="Description du tableau de bord"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="layout">Layout</Label>
              <Select value={formData.layout} onValueChange={(value) => setFormData(prev => ({ ...prev, layout: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">Grille</SelectItem>
                  <SelectItem value="list">Liste</SelectItem>
                  <SelectItem value="custom">Personnalisé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="widgets" className="space-y-4">
            <div className="space-y-2">
              <Label>Widgets disponibles</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="chart" />
                  <Label htmlFor="chart">Graphiques</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="metrics" />
                  <Label htmlFor="metrics">Métriques</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="table" />
                  <Label htmlFor="table">Tableaux</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="calendar" />
                  <Label htmlFor="calendar">Calendrier</Label>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Création..." : "Créer le tableau de bord"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}