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
  Globe, Play, Settings, Plus, X, Save, Eye
} from "lucide-react";
import { toast } from '@/hooks/use-toast';

interface ApiTestingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTest?: (config: ApiTestConfig) => Promise<void>;
}

export interface ApiTestConfig {
  id?: string;
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers: Record<string, string>;
  body?: string;
  expectedStatus: number;
  createdBy: string;
  createdAt: string;
}

export function ApiTestingModal({ isOpen, onClose, onTest }: ApiTestingModalProps) {
  const [formData, setFormData] = useState<Partial<ApiTestConfig>>({
    name: '',
    url: '',
    method: 'GET',
    headers: {},
    expectedStatus: 200,
    createdBy: 'current-user',
    createdAt: new Date().toISOString()
  });
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const handleTest = async () => {
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
      if (onTest) {
        await onTest(formData as ApiTestConfig);
      }
      
      // Simulation d'un test API
      setTestResult({
        status: 200,
        success: true,
        responseTime: 150,
        data: { message: "Test réussi" }
      });
      
      toast({
        title: "Succès",
        description: "Le test API a été exécuté avec succès.",
      });
    } catch (error) {
      setTestResult({
        status: 500,
        success: false,
        responseTime: 0,
        error: "Erreur lors du test"
      });
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors du test.",
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
            Test API
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="config" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="results">Résultats</TabsTrigger>
          </TabsList>

          <TabsContent value="config" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du test *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nom du test"
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
                placeholder="https://api.example.com/test"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expectedStatus">Statut attendu</Label>
                <Input
                  id="expectedStatus"
                  type="number"
                  value={formData.expectedStatus}
                  onChange={(e) => setFormData(prev => ({ ...prev, expectedStatus: parseInt(e.target.value) }))}
                  placeholder="200"
                />
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

            <div className="space-y-2">
              <Label>Headers</Label>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Content-Type" />
                  <Input placeholder="application/json" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Authorization" />
                  <Input placeholder="Bearer token" />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            {testResult ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Statut</span>
                      <Badge variant={testResult.success ? "default" : "destructive"}>
                        {testResult.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Temps de réponse</span>
                      <span>{testResult.responseTime}ms</span>
                    </div>
                    <div className="space-y-2">
                      <span className="font-medium">Réponse</span>
                      <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                        {JSON.stringify(testResult.data || testResult.error, null, 2)}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                Aucun test exécuté. Configurez et lancez un test pour voir les résultats.
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
          <Button onClick={handleTest} disabled={loading}>
            {loading ? "Test en cours..." : "Lancer le test"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}