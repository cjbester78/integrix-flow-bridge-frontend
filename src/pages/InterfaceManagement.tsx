import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import UndeployedInterfaces from './UndeployedInterfaces';
import DeployedInterfaces from './DeployedInterfaces';
import { Rocket, FileCode } from 'lucide-react';

export default function InterfaceManagement() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Interface Management</h1>
        <p className="text-gray-600">Manage your integration interfaces deployment lifecycle</p>
      </div>

      <Card>
        <Tabs defaultValue="undeployed" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="undeployed" className="flex items-center gap-2">
              <FileCode className="w-4 h-4" />
              Undeployed Interfaces
            </TabsTrigger>
            <TabsTrigger value="deployed" className="flex items-center gap-2">
              <Rocket className="w-4 h-4" />
              Deployed Interfaces
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="undeployed" className="mt-6">
            <UndeployedInterfaces />
          </TabsContent>
          
          <TabsContent value="deployed" className="mt-6">
            <DeployedInterfaces />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}