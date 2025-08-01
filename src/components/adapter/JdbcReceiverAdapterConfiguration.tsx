import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdapterConfiguration } from '@/types/adapter';

interface JdbcReceiverAdapterConfigurationProps {
  configuration: AdapterConfiguration;
  onChange: (configuration: AdapterConfiguration) => void;
}

export const JdbcReceiverAdapterConfiguration: React.FC<JdbcReceiverAdapterConfigurationProps> = ({
  configuration,
  onChange,
}) => {
  const updateConfiguration = (updates: Partial<AdapterConfiguration>) => {
    onChange({ ...configuration, ...updates });
  };

  const updateProperties = (key: string, value: string) => {
    const properties = configuration.properties || {};
    updateConfiguration({
      properties: { ...properties, [key]: value }
    });
  };

  const getProperty = (key: string) => {
    return configuration.properties?.[key] || '';
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="target" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="target">Target</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
        </TabsList>

        <TabsContent value="target" className="space-y-6">
          {/* Database Connection Section */}
          <Card>
            <CardHeader>
              <CardTitle>Target Database Connection</CardTitle>
              <CardDescription>
                Configure connection to the target database for data insertion and updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jdbcDriverClass">JDBC Driver Class</Label>
                  <Input
                    id="jdbcDriverClass"
                    placeholder="com.mysql.cj.jdbc.Driver"
                    value={getProperty('jdbcDriverClass')}
                    onChange={(e) => updateProperties('jdbcDriverClass', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jdbcUrl">JDBC URL</Label>
                  <Input
                    id="jdbcUrl"
                    placeholder="jdbc:mysql://dbhost:3306/dbname"
                    value={getProperty('jdbcUrl')}
                    onChange={(e) => updateProperties('jdbcUrl', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="databaseHost">Database Host</Label>
                  <Input
                    id="databaseHost"
                    placeholder="dbhost.example.com"
                    value={getProperty('databaseHost')}
                    onChange={(e) => updateProperties('databaseHost', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="databasePort">Database Port</Label>
                  <Input
                    id="databasePort"
                    type="number"
                    placeholder="3306"
                    value={getProperty('databasePort')}
                    onChange={(e) => updateProperties('databasePort', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="databaseName">Database Name</Label>
                  <Input
                    id="databaseName"
                    placeholder="ordersdb"
                    value={getProperty('databaseName')}
                    onChange={(e) => updateProperties('databaseName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="dbuser"
                    value={getProperty('username')}
                    onChange={(e) => updateProperties('username', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="dbpassword"
                    value={getProperty('password')}
                    onChange={(e) => updateProperties('password', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="connectionPoolSettings">Connection Pool Settings</Label>
                  <Input
                    id="connectionPoolSettings"
                    placeholder="maxPoolSize=10, connectionTimeout=30000"
                    value={getProperty('connectionPoolSettings')}
                    onChange={(e) => updateProperties('connectionPoolSettings', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Insertion and Update Operations */}
          <Card>
            <CardHeader>
              <CardTitle>Data Operations</CardTitle>
              <CardDescription>
                Configure how data is inserted and updated in the target database
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="insertQuery">Insert Query</Label>
                <Textarea
                  id="insertQuery"
                  placeholder="INSERT INTO orders (id, customer_id, amount, status) VALUES (?, ?, ?, ?)"
                  value={getProperty('insertQuery')}
                  onChange={(e) => updateProperties('insertQuery', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="updateQuery">Update Query (Optional)</Label>
                <Textarea
                  id="updateQuery"
                  placeholder="UPDATE orders SET status = ?, updated_date = ? WHERE id = ?"
                  value={getProperty('updateQuery')}
                  onChange={(e) => updateProperties('updateQuery', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deleteQuery">Delete Query (Optional)</Label>
                <Textarea
                  id="deleteQuery"
                  placeholder="DELETE FROM orders WHERE id = ? AND status = 'CANCELLED'"
                  value={getProperty('deleteQuery')}
                  onChange={(e) => updateProperties('deleteQuery', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="batchSize">Batch Size</Label>
                  <Input
                    id="batchSize"
                    type="number"
                    placeholder="100"
                    value={getProperty('batchSize')}
                    onChange={(e) => updateProperties('batchSize', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commitInterval">Commit Interval</Label>
                  <Input
                    id="commitInterval"
                    type="number"
                    placeholder="1000"
                    value={getProperty('commitInterval')}
                    onChange={(e) => updateProperties('commitInterval', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="transactionIsolationLevel">Transaction Isolation Level</Label>
                <Select
                  value={getProperty('transactionIsolationLevel')}
                  onValueChange={(value) => updateProperties('transactionIsolationLevel', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select isolation level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="READ_UNCOMMITTED">READ_UNCOMMITTED</SelectItem>
                    <SelectItem value="READ_COMMITTED">READ_COMMITTED</SelectItem>
                    <SelectItem value="REPEATABLE_READ">REPEATABLE_READ</SelectItem>
                    <SelectItem value="SERIALIZABLE">SERIALIZABLE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="processing" className="space-y-6">
          {/* Data Transformation & Validation Section */}
          <Card>
            <CardHeader>
              <CardTitle>Data Transformation & Validation</CardTitle>
              <CardDescription>
                Configure data mapping and validation rules
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dataMappingRules">Data Mapping Rules</Label>
                <Textarea
                  id="dataMappingRules"
                  placeholder="Map order_id to OrderID"
                  value={getProperty('dataMappingRules')}
                  onChange={(e) => updateProperties('dataMappingRules', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="validationRules">Validation Rules</Label>
                <Textarea
                  id="validationRules"
                  placeholder="Non-null checks, formats"
                  value={getProperty('validationRules')}
                  onChange={(e) => updateProperties('validationRules', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};