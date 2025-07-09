import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Settings as SettingsIcon, 
  Save, 
  RefreshCw,
  Bell,
  Shield,
  Database,
  Network,
  Palette,
  Monitor
} from 'lucide-react';

export const Settings = () => {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="animate-slide-up">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <SettingsIcon className="h-8 w-8" />
          Settings
        </h1>
        <p className="text-muted-foreground">Configure your IntegrixLab platform preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="animate-scale-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Configure notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Email Notifications</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Flow failures</span>
                  <Badge variant="default">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Daily reports</span>
                  <Badge variant="secondary">Disabled</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Interface
            </CardTitle>
            <CardDescription>Customize the user interface</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Theme Settings</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Dark mode</span>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Compact view</span>
                  <Badge variant="secondary">Disabled</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              System Configuration
            </CardTitle>
            <CardDescription>Core system settings and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="maxConnections">Max Concurrent Connections</Label>
              <Input id="maxConnections" type="number" defaultValue="100" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeout">Connection Timeout (ms)</Label>
              <Input id="timeout" type="number" defaultValue="30000" />
            </div>
          </CardContent>
        </Card>

        <Card className="animate-scale-in" style={{ animationDelay: '0.3s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>Security and authentication settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Session Settings</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Session timeout</span>
                  <span className="text-sm text-muted-foreground">24 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Multi-factor auth</span>
                  <Badge variant="secondary">Disabled</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end space-x-3">
        <Button variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset to Defaults
        </Button>
        <Button className="bg-gradient-primary hover:opacity-90">
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};