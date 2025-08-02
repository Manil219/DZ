import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Clock, CheckCircle, XCircle, Eye, FileText, Users, 
  AlertTriangle, Filter, Search, Calendar, User, MessageSquare,
  ThumbsUp, ThumbsDown, History, ArrowRight, ArrowLeft, X
} from "lucide-react";
import { toast } from '@/hooks/use-toast';

interface ApprovalQueueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove?: (item: ApprovalItem) => Promise<void>;
  onReject?: (item: ApprovalItem, reason: string) => Promise<void>;
  onView?: (item: ApprovalItem) => void;
}

export interface ApprovalItem {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'procedure' | 'legal_text' | 'policy' | 'user_request';
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  submittedBy: string;
  submittedAt: string;
  assignedTo?: string;
  deadline?: string;
  comments: ApprovalComment[];
  metadata: Record<string, any>;
}

interface ApprovalComment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  type: 'comment' | 'approval' | 'rejection';
}

export function ApprovalQueueModal({ isOpen, onClose, onApprove, onReject, onView }: ApprovalQueueModalProps) {
  const [items, setItems] = useState<ApprovalItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ApprovalItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [activeTab, setActiveTab] = useState('queue');

  // Données de démonstration
  useEffect(() => {
    const mockItems: ApprovalItem[] = [
      {
        id: '1',
        title: 'Nouvelle procédure administrative',
        description: 'Procédure pour la gestion des demandes de congés',
        type: 'procedure',
        status: 'pending',
        priority: 'medium',
        submittedBy: 'Jean Dupont',
        submittedAt: '2024-01-15T10:30:00Z',
        assignedTo: 'Marie Martin',
        deadline: '2024-01-20T17:00:00Z',
        comments: [
          {
            id: '1',
            author: 'Jean Dupont',
            content: 'Procédure mise à jour selon les nouvelles directives',
            timestamp: '2024-01-15T10:30:00Z',
            type: 'comment'
          }
        ],
        metadata: {
          department: 'RH',
          version: '2.1',
          affectedUsers: 150
        }
      },
      {
        id: '2',
        title: 'Modification de la politique de sécurité',
        description: 'Mise à jour des règles d\'accès aux documents sensibles',
        type: 'policy',
        status: 'under_review',
        priority: 'high',
        submittedBy: 'Pierre Durand',
        submittedAt: '2024-01-14T14:20:00Z',
        assignedTo: 'Sophie Bernard',
        deadline: '2024-01-18T17:00:00Z',
        comments: [
          {
            id: '2',
            author: 'Pierre Durand',
            content: 'Nouvelles règles conformes au RGPD',
            timestamp: '2024-01-14T14:20:00Z',
            type: 'comment'
          },
          {
            id: '3',
            author: 'Sophie Bernard',
            content: 'En cours de révision par l\'équipe juridique',
            timestamp: '2024-01-15T09:15:00Z',
            type: 'comment'
          }
        ],
        metadata: {
          department: 'IT',
          compliance: 'RGPD',
          riskLevel: 'medium'
        }
      }
    ];
    setItems(mockItems);
  }, []);

  const filteredItems = items.filter(item => {
    const matchesFilter = filter === 'all' || item.status === filter;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleApprove = async (item: ApprovalItem) => {
    setLoading(true);
    try {
      if (onApprove) {
        await onApprove(item);
      }
      setItems(prev => prev.map(i => 
        i.id === item.id ? { ...i, status: 'approved' as const } : i
      ));
      toast({
        title: "Approuvé",
        description: "L'élément a été approuvé avec succès.",
      });
      setSelectedItem(null);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'approbation.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (item: ApprovalItem) => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez fournir une raison de rejet.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (onReject) {
        await onReject(item, rejectionReason);
      }
      setItems(prev => prev.map(i => 
        i.id === item.id ? { ...i, status: 'rejected' as const } : i
      ));
      toast({
        title: "Rejeté",
        description: "L'élément a été rejeté.",
      });
      setSelectedItem(null);
      setRejectionReason('');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors du rejet.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'default',
      approved: 'default',
      rejected: 'destructive',
      under_review: 'secondary'
    } as const;
    
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      under_review: 'bg-blue-100 text-blue-800'
    };

    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
        {status === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
        {status === 'rejected' && <XCircle className="h-3 w-3 mr-1" />}
        {status === 'under_review' && <Eye className="h-3 w-3 mr-1" />}
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };

    return (
      <Badge className={colors[priority as keyof typeof colors]}>
        {priority}
      </Badge>
    );
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      document: FileText,
      procedure: FileText,
      legal_text: FileText,
      policy: FileText,
      user_request: Users
    };
    const Icon = icons[type as keyof typeof icons];
    return Icon ? <Icon className="h-4 w-4" /> : <FileText className="h-4 w-4" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            File d'Attente d'Approbation
          </DialogTitle>
        </DialogHeader>

        <div className="flex h-full gap-4">
          {/* Liste des éléments */}
          <div className="flex-1 flex flex-col">
            <div className="flex gap-2 mb-4">
              <div className="flex-1">
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="under_review">En révision</SelectItem>
                  <SelectItem value="approved">Approuvés</SelectItem>
                  <SelectItem value="rejected">Rejetés</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <ScrollArea className="flex-1">
              <div className="space-y-2">
                {filteredItems.map((item) => (
                  <Card 
                    key={item.id} 
                    className={`cursor-pointer transition-colors ${
                      selectedItem?.id === item.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedItem(item)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="mt-1">
                            {getTypeIcon(item.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-sm font-medium truncate">
                              {item.title}
                            </CardTitle>
                            <CardDescription className="text-xs text-muted-foreground mt-1">
                              {item.description}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {getStatusBadge(item.status)}
                          {getPriorityBadge(item.priority)}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                        <div className="flex items-center gap-4">
                          <span>Par: {item.submittedBy}</span>
                          <span>Le: {new Date(item.submittedAt).toLocaleDateString()}</span>
                        </div>
                        {item.deadline && (
                          <span className="text-orange-600">
                            Échéance: {new Date(item.deadline).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Détails de l'élément sélectionné */}
          {selectedItem && (
            <div className="w-96 border-l">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Détails</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedItem(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="details">Détails</TabsTrigger>
                    <TabsTrigger value="comments">Commentaires</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Titre</Label>
                      <p className="text-sm mt-1">{selectedItem.title}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Description</Label>
                      <p className="text-sm mt-1">{selectedItem.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Type</Label>
                        <p className="text-sm mt-1 capitalize">{selectedItem.type.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Soumis par</Label>
                        <p className="text-sm mt-1">{selectedItem.submittedBy}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Date de soumission</Label>
                        <p className="text-sm mt-1">
                          {new Date(selectedItem.submittedAt).toLocaleString()}
                        </p>
                      </div>
                      {selectedItem.deadline && (
                        <div>
                          <Label className="text-sm font-medium">Échéance</Label>
                          <p className="text-sm mt-1">
                            {new Date(selectedItem.deadline).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                    {selectedItem.assignedTo && (
                      <div>
                        <Label className="text-sm font-medium">Assigné à</Label>
                        <p className="text-sm mt-1">{selectedItem.assignedTo}</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="comments" className="space-y-4">
                    <ScrollArea className="h-64">
                      <div className="space-y-3">
                        {selectedItem.comments.map((comment) => (
                          <div key={comment.id} className="border rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">{comment.author}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(comment.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm">{comment.content}</p>
                            {comment.type !== 'comment' && (
                              <Badge className="mt-2" variant={comment.type === 'approval' ? 'default' : 'destructive'}>
                                {comment.type === 'approval' ? 'Approuvé' : 'Rejeté'}
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>

                <Separator className="my-4" />

                {/* Actions */}
                {selectedItem.status === 'pending' && (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApprove(selectedItem)}
                        disabled={loading}
                        className="flex-1"
                        size="sm"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approuver
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => onView?.(selectedItem)}
                        size="sm"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Voir
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Raison du rejet (optionnel)</Label>
                      <Textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Expliquez pourquoi vous rejetez cet élément..."
                        rows={2}
                      />
                      <Button
                        variant="destructive"
                        onClick={() => handleReject(selectedItem)}
                        disabled={loading || !rejectionReason.trim()}
                        size="sm"
                        className="w-full"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Rejeter
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}