import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, Plus, X, Save, Eye, Settings
} from "lucide-react";
import { toast } from '@/hooks/use-toast';

interface CreateAnnotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (annotation: Annotation) => Promise<void>;
}

export interface Annotation {
  id?: string;
  text: string;
  type: 'comment' | 'highlight' | 'suggestion' | 'correction';
  position: { x: number; y: number };
  color: string;
  createdBy: string;
  createdAt: string;
}

export function CreateAnnotationModal({ isOpen, onClose, onSave }: CreateAnnotationModalProps) {
  const [formData, setFormData] = useState<Partial<Annotation>>({
    text: '',
    type: 'comment',
    position: { x: 0, y: 0 },
    color: '#3b82f6',
    createdBy: 'current-user',
    createdAt: new Date().toISOString()
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!formData.text) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir le texte de l'annotation.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (onSave) {
        await onSave(formData as Annotation);
      }
      toast({
        title: "Succès",
        description: "L'annotation a été créée avec succès.",
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
            <MessageSquare className="h-5 w-5" />
            Créer une Annotation
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="content">Contenu</TabsTrigger>
            <TabsTrigger value="style">Style</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comment">Commentaire</SelectItem>
                    <SelectItem value="highlight">Surlignage</SelectItem>
                    <SelectItem value="suggestion">Suggestion</SelectItem>
                    <SelectItem value="correction">Correction</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Couleur</Label>
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  className="h-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="text">Texte de l'annotation *</Label>
              <Textarea
                id="text"
                value={formData.text}
                onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
                placeholder="Saisissez votre annotation..."
                rows={4}
              />
            </div>
          </TabsContent>

          <TabsContent value="style" className="space-y-4">
            <div className="space-y-2">
              <Label>Position</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="x">X</Label>
                  <Input
                    id="x"
                    type="number"
                    value={formData.position?.x}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      position: { ...prev.position!, x: parseInt(e.target.value) }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="y">Y</Label>
                  <Input
                    id="y"
                    type="number"
                    value={formData.position?.y}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      position: { ...prev.position!, y: parseInt(e.target.value) }
                    }))}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Options d'affichage</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="visible" defaultChecked />
                  <Label htmlFor="visible">Visible</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="editable" defaultChecked />
                  <Label htmlFor="editable">Modifiable</Label>
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
            {loading ? "Création..." : "Créer l'annotation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}