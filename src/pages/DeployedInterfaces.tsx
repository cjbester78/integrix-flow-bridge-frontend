import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { flowService } from '@/services/flowService';
import { deploymentService } from '@/services/deploymentService';
import { Loader2, Info, Power, CheckCircle } from 'lucide-react';
import { IntegrationFlow } from '@/types/flow';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function DeployedInterfaces() {
  const [flows, setFlows] = useState<IntegrationFlow[]>([]);
  const [loading, setLoading] = useState(true);
  const [undeployingFlowId, setUndeployingFlowId] = useState<string | null>(null);
  const [showUndeployDialog, setShowUndeployDialog] = useState(false);
  const [selectedFlow, setSelectedFlow] = useState<IntegrationFlow | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDeployedFlows();
  }, []);

  const fetchDeployedFlows = async () => {
    try {
      setLoading(true);
      const response = await flowService.getFlows();
      if (response.success && response.data) {
        // Filter for deployed flows
        const deployedFlows = response.data.filter(
          flow => flow.status === 'DEPLOYED_ACTIVE' || flow.status === 'ACTIVE'
        );
        setFlows(deployedFlows);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch deployed interfaces',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (flow: IntegrationFlow) => {
    navigate(`/interfaces/${flow.id}/details`);
  };

  const handleUndeploy = (flow: IntegrationFlow) => {
    setSelectedFlow(flow);
    setShowUndeployDialog(true);
  };

  const confirmUndeploy = async () => {
    if (!selectedFlow) return;

    try {
      setUndeployingFlowId(selectedFlow.id);
      setShowUndeployDialog(false);
      
      const response = await deploymentService.undeployFlow(selectedFlow.id);
      
      if (response.success) {
        toast({
          title: 'Success',
          description: `Interface "${selectedFlow.name}" has been undeployed`,
        });
        // Refresh the list
        fetchDeployedFlows();
      } else {
        toast({
          variant: 'destructive',
          title: 'Undeploy Failed',
          description: response.error || 'Failed to undeploy interface',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An error occurred during undeployment',
      });
    } finally {
      setUndeployingFlowId(null);
      setSelectedFlow(null);
    }
  };

  const getAdapterInfo = (flow: IntegrationFlow) => {
    return {
      sourceType: flow.sourceAdapter?.type || 'Unknown',
      targetType: flow.targetAdapter?.type || 'Unknown',
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (flows.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No deployed interfaces found</p>
          <p className="text-sm text-muted-foreground mt-2">
            Deploy interfaces from the undeployed tab to see them here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Deployed Interfaces</CardTitle>
          <CardDescription>
            Active interfaces that are receiving calls from external systems and running scheduled tasks.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Interface Name</TableHead>
                <TableHead>Source → Target</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Deployed At</TableHead>
                <TableHead>Endpoint</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flows.map((flow) => {
                const adapterInfo = getAdapterInfo(flow);
                const isUndeploying = undeployingFlowId === flow.id;
                
                return (
                  <TableRow key={flow.id}>
                    <TableCell className="font-medium">{flow.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Badge variant="outline">{adapterInfo.sourceType}</Badge>
                        <span>→</span>
                        <Badge variant="outline">{adapterInfo.targetType}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="success">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {flow.deployedAt ? new Date(flow.deployedAt).toLocaleString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {flow.deploymentEndpoint ? 
                          flow.deploymentEndpoint.substring(0, 40) + '...' : 
                          'N/A'
                        }
                      </code>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(flow)}
                        >
                          <Info className="h-4 w-4" />
                          Details
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleUndeploy(flow)}
                          disabled={isUndeploying}
                        >
                          {isUndeploying ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Power className="h-4 w-4" />
                          )}
                          Undeploy
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={showUndeployDialog} onOpenChange={setShowUndeployDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Undeploy Interface</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to undeploy "{selectedFlow?.name}"? 
              This will deactivate the interface and stop receiving external calls. 
              All endpoint information will be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmUndeploy}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Undeploy
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}