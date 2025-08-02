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
  Globe, Download, Database, Settings, Plus, X, Save, Eye
} from "lucide-react";
import { toast } from '@/hooks/use-toast';

interface ApiImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport?: (config: ApiImportConfig) => Promise<void>;
}

export interface ApiImportConfig {
  id?: string;
  name: string;
  description: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers: Record<string, string>;
  body?: string;
  format: 'json' | 'xml' | 'csv';
  mapping: Record<string, string>;
  schedule?: string;
  createdBy: string;
  createdAt: string;
}

export function ApiImportModal({ isOpen, onClose, onImport }: ApiImportModalProps) {
  const [formData, setFormData] = useState<Partial<ApiImportConfig>>({
    name: '',
    description: '',
    url: '',
    method: 'GET',
    headers: {},
    format: 'json',
    mapping: {},
    createdBy: 'current-user',
    createdAt: new Date().toISOString()
  });
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    if (!formData.name || !formData.url) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (onImport) {
        await onImport(formData as ApiImportConfig);
      }
      toast({
        title: "Succès",
        description: "L'import API a été configuré avec succès.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'import.",
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
            <Globe className="h-5 w-5" />
            Import API
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
            <TabsTrigger value="mapping">Mapping</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nom de l'import"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="method">Méthode</Label>
                <Select value={formData.method} onValueChange={(value) => setFormData(prev => ({ ...prev, method: value as any }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL *</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://api.example.com/data"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description de l'import"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="format">Format</Label>
                <Select value={formData.format} onValueChange={(value) => setFormData(prev => ({ ...prev, format: value as any }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="xml">XML</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="schedule">Planification</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une planification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manuel</SelectItem>
                    <SelectItem value="hourly">Toutes les heures</SelectItem>
                    <SelectItem value="daily">Quotidien</SelectItem>
                    <SelectItem value="weekly">Hebdomadaire</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.method !== 'GET' && (
              <div className="space-y-2">
                <Label htmlFor="body">Corps de la requête</Label>
                <Textarea
                  id="body"
                  value={formData.body}
                  onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
                  placeholder='{"key": "value"}'
                  rows={3}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="headers" className="space-y-4">
            <div className="space-y-2">
              <Label>Headers de la requête</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="content-type" />
                  <Label htmlFor="content-type">Content-Type: application/json</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="authorization" />
                  <Label htmlFor="authorization">Authorization: Bearer token</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="accept" />
                  <Label htmlFor="accept">Accept: application/json</Label>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="mapping" className="space-y-4">
            <div className="space-y-2">
              <Label>Mapping des champs</Label>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Champ source" />
                  <Input placeholder="Champ destination" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Champ source" />
                  <Input placeholder="Champ destination" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Champ source" />
                  <Input placeholder="Champ destination" />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleImport} disabled={loading}>
            {loading ? "Import..." : "Configurer l'import"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}