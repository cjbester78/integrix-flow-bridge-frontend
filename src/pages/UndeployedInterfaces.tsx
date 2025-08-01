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
import { Loader2, Rocket, Settings, AlertCircle } from 'lucide-react';
import { IntegrationFlow } from '@/types/flow';
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

export default function UndeployedInterfaces() {
  const [flows, setFlows] = useState<IntegrationFlow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deployingFlowId, setDeployingFlowId] = useState<string | null>(null);
  const [showDeployDialog, setShowDeployDialog] = useState(false);
  const [selectedFlow, setSelectedFlow] = useState<IntegrationFlow | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchUndeployedFlows();
  }, []);

  const fetchUndeployedFlows = async () => {
    try {
      setLoading(true);
      const response = await flowService.getFlows();
      if (response.success && response.data) {
        // Filter for undeployed flows
        const undeployedFlows = response.data.filter(
          flow => flow.status === 'DEVELOPED_INACTIVE' || 
                  flow.status === 'DRAFT' || 
                  flow.status === 'INACTIVE'
        );
        setFlows(undeployedFlows);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch undeployed interfaces',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeploy = (flow: IntegrationFlow) => {
    setSelectedFlow(flow);
    setShowDeployDialog(true);
  };

  const confirmDeploy = async () => {
    if (!selectedFlow) return;

    try {
      setDeployingFlowId(selectedFlow.id);
      setShowDeployDialog(false);
      
      const response = await deploymentService.deployFlow(selectedFlow.id);
      
      if (response.success) {
        toast({
          title: 'Success',
          description: `Interface "${selectedFlow.name}" has been deployed successfully`,
        });
        // Refresh the list
        fetchUndeployedFlows();
      } else {
        toast({
          variant: 'destructive',
          title: 'Deployment Failed',
          description: response.error || 'Failed to deploy interface',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An error occurred during deployment',
      });
    } finally {
      setDeployingFlowId(null);
      setSelectedFlow(null);
    }
  };

  const getAdapterInfo = (flow: IntegrationFlow) => {
    // This would ideally come from the flow data
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
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No undeployed interfaces found</p>
          <p className="text-sm text-muted-foreground mt-2">
            Create new interfaces or check the deployed interfaces tab
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Undeployed Interfaces</CardTitle>
          <CardDescription>
            These interfaces are in development and not receiving external calls. 
            Deploy them to make them available for production use.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Interface Name</TableHead>
                <TableHead>Source → Target</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Mapping Mode</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flows.map((flow) => {
                const adapterInfo = getAdapterInfo(flow);
                const isDeploying = deployingFlowId === flow.id;
                
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
                      <Badge variant="secondary">{flow.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={flow.mappingMode === 'PASS_THROUGH' ? 'outline' : 'default'}>
                        {flow.mappingMode === 'PASS_THROUGH' ? 'Pass-through' : 'With Mapping'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(flow.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.location.href = `/flows/${flow.id}/edit`}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleDeploy(flow)}
                          disabled={isDeploying || flow.status === 'DRAFT'}
                        >
                          {isDeploying ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Rocket className="h-4 w-4" />
                          )}
                          Deploy
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

      <AlertDialog open={showDeployDialog} onOpenChange={setShowDeployDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deploy Interface</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to deploy "{selectedFlow?.name}"? 
              This will make the interface available for external calls and activate any configured timers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeploy}>Deploy</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}