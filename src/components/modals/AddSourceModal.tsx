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
  Database, Globe, FileText, Plus, X, Save, Eye
} from "lucide-react";
import { toast } from '@/hooks/use-toast';

interface AddSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (source: DataSource) => Promise<void>;
}

export interface DataSource {
  id?: string;
  name: string;
  description: string;
  type: 'database' | 'api' | 'file' | 'web';
  url?: string;
  credentials: Record<string, string>;
  enabled: boolean;
  createdBy: string;
  createdAt: string;
}

export function AddSourceModal({ isOpen, onClose, onSave }: AddSourceModalProps) {
  const [formData, setFormData] = useState<Partial<DataSource>>({
    name: '',
    description: '',
    type: 'database',
    credentials: {},
    enabled: true,
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
        await onSave(formData as DataSource);
      }
      toast({
        title: "Succès",
        description: "La source de données a été ajoutée avec succès.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'ajout.",
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
            <Database className="h-5 w-5" />
            Ajouter une Source de Données
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="credentials">Identifiants</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nom de la source"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="database">Base de données</SelectItem>
                    <SelectItem value="api">API</SelectItem>
                    <SelectItem value="file">Fichier</SelectItem>
                    <SelectItem value="web">Web</SelectItem>
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
                placeholder="Description de la source"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL/Chemin</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                placeholder="URL ou chemin vers la source"
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
          </TabsContent>

          <TabsContent value="credentials" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nom d'utilisateur</Label>
                <Input placeholder="Nom d'utilisateur" />
              </div>
              <div className="space-y-2">
                <Label>Mot de passe</Label>
                <Input type="password" placeholder="Mot de passe" />
              </div>
              <div className="space-y-2">
                <Label>Clé API (optionnel)</Label>
                <Input placeholder="Clé API" />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Ajout..." : "Ajouter la source"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}