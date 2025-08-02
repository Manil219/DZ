import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Settings, Cog, Wrench, Tool
} from "lucide-react";
import { toast } from '@/hooks/use-toast';

interface FunctionalModalsProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'settings' | 'configuration' | 'tools' | 'utilities';
  onSave?: (data: any) => Promise<void>;
}

export function FunctionalModals({ isOpen, onClose, type, onSave }: FunctionalModalsProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    enabled: true
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

  const getTypeTitle = (type: string) => {
    const titles = {
      settings: 'Paramètres',
      configuration: 'Configuration',
      tools: 'Outils',
      utilities: 'Utilitaires'
    };
    return titles[type as keyof typeof titles] || 'Fonctionnalité';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {getTypeTitle(type)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
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
        </div>

        <DialogFooter>
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