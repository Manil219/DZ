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
  Share, FileText, Users, Lock, Eye, Calendar, Plus, X
} from "lucide-react";
import { toast } from '@/hooks/use-toast';

interface AddSharedResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (resource: SharedResource) => Promise<void>;
}

export interface SharedResource {
  id?: string;
  name: string;
  description: string;
  type: 'document' | 'folder' | 'link' | 'application';
  url?: string;
  permissions: string[];
  users: string[];
  groups: string[];
  expiryDate?: string;
  createdBy: string;
  createdAt: string;
}

export function AddSharedResourceModal({ isOpen, onClose, onSave }: AddSharedResourceModalProps) {
  const [formData, setFormData] = useState<Partial<SharedResource>>({
    name: '',
    description: '',
    type: 'document',
    permissions: ['read'],
    users: [],
    groups: [],
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
        await onSave(formData as SharedResource);
      }
      toast({
        title: "Succès",
        description: "La ressource partagée a été créée avec succès.",
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
            <Share className="h-5 w-5" />
            Ajouter une Ressource Partagée
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nom de la ressource"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="folder">Dossier</SelectItem>
                    <SelectItem value="link">Lien</SelectItem>
                    <SelectItem value="application">Application</SelectItem>
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
                placeholder="Description de la ressource"
                rows={3}
              />
            </div>

            {formData.type === 'link' && (
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://example.com"
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="permissions" className="space-y-4">
            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="read" 
                    checked={formData.permissions?.includes('read')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({
                          ...prev,
                          permissions: [...(prev.permissions || []), 'read']
                        }));
                      } else {
                        setFormData(prev => ({
                          ...prev,
                          permissions: prev.permissions?.filter(p => p !== 'read')
                        }));
                      }
                    }}
                  />
                  <Label htmlFor="read">Lecture</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="write" 
                    checked={formData.permissions?.includes('write')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({
                          ...prev,
                          permissions: [...(prev.permissions || []), 'write']
                        }));
                      } else {
                        setFormData(prev => ({
                          ...prev,
                          permissions: prev.permissions?.filter(p => p !== 'write')
                        }));
                      }
                    }}
                  />
                  <Label htmlFor="write">Écriture</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="admin" 
                    checked={formData.permissions?.includes('admin')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({
                          ...prev,
                          permissions: [...(prev.permissions || []), 'admin']
                        }));
                      } else {
                        setFormData(prev => ({
                          ...prev,
                          permissions: prev.permissions?.filter(p => p !== 'admin')
                        }));
                      }
                    }}
                  />
                  <Label htmlFor="admin">Administration</Label>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <div className="space-y-2">
              <Label>Utilisateurs</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner des utilisateurs" />
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
                  <SelectValue placeholder="Sélectionner des groupes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun groupe</SelectItem>
                  <SelectItem value="all">Tous les groupes</SelectItem>
                  <SelectItem value="custom">Groupes spécifiques</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date d'expiration (optionnel)</Label>
              <Input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
              />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Création..." : "Créer la ressource"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}