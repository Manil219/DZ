import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Download, Upload, Settings, Database, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ApiImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ApiImportConfig {
  name: string;
  description: string;
  apiUrl: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers: Record<string, string>;
  body: string;
  authentication: {
    type: 'none' | 'basic' | 'bearer' | 'api_key';
    credentials: Record<string, string>;
  };
  schedule: {
    enabled: boolean;
    frequency: string;
    time: string;
  };
  mapping: {
    sourceField: string;
    targetField: string;
  }[];
}

export const ApiImportModal: React.FC<ApiImportModalProps> = ({
  isOpen,
  onClose
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('connection');
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<ApiImportConfig>({
    name: '',
    description: '',
    apiUrl: '',
    method: 'GET',
    headers: {},
    body: '',
    authentication: {
      type: 'none',
      credentials: {}
    },
    schedule: {
      enabled: false,
      frequency: 'daily',
      time: '09:00'
    },
    mapping: []
  });

  const handleTestConnection = async () => {
    setIsLoading(true);
    try {
      // Simulate API test
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: 'Connection successful',
        description: 'API connection test completed successfully.',
      });
    } catch (error) {
      toast({
        title: 'Connection failed',
        description: 'Failed to connect to the API.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async () => {
    setIsLoading(true);
    try {
      // Simulate import
      await new Promise(resolve => setTimeout(resolve, 3000));
      toast({
        title: 'Import successful',
        description: 'Data has been imported successfully.',
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Import failed',
        description: 'Failed to import data from API.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            API Import Configuration
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="connection">Connection</TabsTrigger>
            <TabsTrigger value="auth">Authentication</TabsTrigger>
            <TabsTrigger value="mapping">Data Mapping</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="connection" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Import Name</Label>
                <Input
                  id="name"
                  value={config.name}
                  onChange={(e) => setConfig({ ...config, name: e.target.value })}
                  placeholder="Enter import name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="method">HTTP Method</Label>
                <Select value={config.method} onValueChange={(value: any) => setConfig({ ...config, method: value })}>
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
              <Label htmlFor="apiUrl">API URL</Label>
              <Input
                id="apiUrl"
                value={config.apiUrl}
                onChange={(e) => setConfig({ ...config, apiUrl: e.target.value })}
                placeholder="https://api.example.com/data"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={config.description}
                onChange={(e) => setConfig({ ...config, description: e.target.value })}
                placeholder="Enter description"
                rows={3}
              />
            </div>

            {config.method !== 'GET' && (
              <div className="space-y-2">
                <Label htmlFor="body">Request Body (JSON)</Label>
                <Textarea
                  id="body"
                  value={config.body}
                  onChange={(e) => setConfig({ ...config, body: e.target.value })}
                  placeholder='{"key": "value"}'
                  rows={4}
                />
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleTestConnection} disabled={isLoading}>
                <Database className="h-4 w-4 mr-1" />
                Test Connection
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="auth" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="authType">Authentication Type</Label>
              <Select value={config.authentication.type} onValueChange={(value: any) => setConfig({ ...config, authentication: { ...config.authentication, type: value } })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="basic">Basic Auth</SelectItem>
                  <SelectItem value="bearer">Bearer Token</SelectItem>
                  <SelectItem value="api_key">API Key</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {config.authentication.type === 'basic' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                  />
                </div>
              </div>
            )}

            {config.authentication.type === 'bearer' && (
              <div className="space-y-2">
                <Label htmlFor="token">Bearer Token</Label>
                <Input
                  id="token"
                  type="password"
                  placeholder="Enter bearer token"
                />
              </div>
            )}

            {config.authentication.type === 'api_key' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="keyName">Key Name</Label>
                  <Input
                    id="keyName"
                    placeholder="e.g., X-API-Key"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="keyValue">Key Value</Label>
                  <Input
                    id="keyValue"
                    type="password"
                    placeholder="Enter API key"
                  />
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="mapping" className="space-y-4">
            <div className="space-y-2">
              <Label>Field Mapping</Label>
              <div className="text-sm text-muted-foreground">
                Map API response fields to your data structure
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Source Field (API)</Label>
                  <Input placeholder="e.g., user.name" />
                </div>
                <div className="space-y-2">
                  <Label>Target Field (System)</Label>
                  <Input placeholder="e.g., fullName" />
                </div>
              </div>
            </div>

            <Button variant="outline" size="sm">
              Add Field Mapping
            </Button>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="schedule-enabled"
                checked={config.schedule.enabled}
                onCheckedChange={(checked) => setConfig({ ...config, schedule: { ...config.schedule, enabled: checked } })}
              />
              <Label htmlFor="schedule-enabled">Enable scheduled import</Label>
            </div>

            {config.schedule.enabled && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select value={config.schedule.frequency} onValueChange={(value) => setConfig({ ...config, schedule: { ...config.schedule, frequency: value } })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={config.schedule.time}
                    onChange={(e) => setConfig({ ...config, schedule: { ...config.schedule, time: e.target.value } })}
                  />
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={isLoading}>
            <Upload className="h-4 w-4 mr-1" />
            {isLoading ? 'Importing...' : 'Start Import'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};