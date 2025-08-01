import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Settings, Save, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface SystemSetting {
  id: string;
  settingKey: string;
  settingValue: string;
  description: string;
  category: string;
  dataType: string;
  isEncrypted: boolean;
  isReadonly: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

interface SystemSettingsProps {}

export const SystemSettings = ({}: SystemSettingsProps) => {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editedSettings, setEditedSettings] = useState<Record<string, string>>({});

  // Fetch all system settings
  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/system-settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      } else {
        toast.error('Failed to load system settings');
      }
    } catch (error) {
      console.error('Error fetching system settings:', error);
      toast.error('Error loading system settings');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/system-settings/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(['all', ...data]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Initialize default settings
  const initializeSettings = async () => {
    try {
      const response = await fetch('/api/system-settings/initialize', {
        method: 'POST'
      });
      if (response.ok) {
        toast.success('Default settings initialized');
        fetchSettings();
      } else {
        toast.error('Failed to initialize settings');
      }
    } catch (error) {
      console.error('Error initializing settings:', error);
      toast.error('Error initializing settings');
    }
  };

  // Save setting
  const saveSetting = async (settingKey: string, settingValue: string) => {
    try {
      setIsSaving(true);
      const setting = settings.find(s => s.settingKey === settingKey);
      if (!setting) return;

      const updatedSetting = {
        ...setting,
        settingValue,
        updatedBy: 'admin' // In real app, get from auth context
      };

      const response = await fetch(`/api/system-settings/${settingKey}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedSetting)
      });

      if (response.ok) {
        const savedSetting = await response.json();
        setSettings(prev => 
          prev.map(s => s.settingKey === settingKey ? savedSetting : s)
        );
        // Remove from edited settings
        setEditedSettings(prev => {
          const newEdited = { ...prev };
          delete newEdited[settingKey];
          return newEdited;
        });
        toast.success(`Setting "${settingKey}" updated successfully`);
      } else {
        toast.error('Failed to save setting');
      }
    } catch (error) {
      console.error('Error saving setting:', error);
      toast.error('Error saving setting');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle input change
  const handleInputChange = (settingKey: string, value: string) => {
    setEditedSettings(prev => ({
      ...prev,
      [settingKey]: value
    }));
  };

  // Get current value for setting (edited or original)
  const getCurrentValue = (setting: SystemSetting) => {
    return editedSettings[setting.settingKey] ?? setting.settingValue;
  };

  // Check if setting has been edited
  const isEdited = (setting: SystemSetting) => {
    return editedSettings[setting.settingKey] !== undefined && 
           editedSettings[setting.settingKey] !== setting.settingValue;
  };

  // Filter settings by category
  const filteredSettings = activeCategory === 'all' 
    ? settings 
    : settings.filter(s => s.category === activeCategory);

  useEffect(() => {
    fetchSettings();
    fetchCategories();
  }, []);

  const renderSettingCard = (setting: SystemSetting) => (
    <Card key={setting.id} className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              {setting.settingKey}
              {setting.isReadonly && (
                <Badge variant="secondary" className="text-xs">
                  Readonly
                </Badge>
              )}
              {setting.isEncrypted && (
                <Badge variant="outline" className="text-xs">
                  Encrypted
                </Badge>
              )}
              {isEdited(setting) && (
                <Badge variant="destructive" className="text-xs">
                  Modified
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="text-xs">
              {setting.description}
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs">
            {setting.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor={`setting-${setting.id}`} className="text-xs">
              Value ({setting.dataType})
            </Label>
            <div className="flex gap-2">
              <Input
                id={`setting-${setting.id}`}
                value={getCurrentValue(setting)}
                onChange={(e) => handleInputChange(setting.settingKey, e.target.value)}
                disabled={setting.isReadonly}
                type={setting.dataType === 'PASSWORD' ? 'password' : setting.dataType === 'INTEGER' ? 'number' : 'text'}
                className="text-sm"
                placeholder={setting.settingValue}
              />
              {isEdited(setting) && (
                <Button
                  size="sm"
                  onClick={() => saveSetting(setting.settingKey, editedSettings[setting.settingKey])}
                  disabled={isSaving}
                  className="px-3"
                >
                  {isSaving ? (
                    <RefreshCw className="h-3 w-3 animate-spin" />
                  ) : (
                    <Save className="h-3 w-3" />
                  )}
                </Button>
              )}
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>Created: {new Date(setting.createdAt).toLocaleString()}</span>
              <span>Updated: {new Date(setting.updatedAt).toLocaleString()}</span>
            </div>
            {(setting.createdBy || setting.updatedBy) && (
              <div className="flex justify-between">
                {setting.createdBy && <span>Created by: {setting.createdBy}</span>}
                {setting.updatedBy && <span>Updated by: {setting.updatedBy}</span>}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6" />
            System Settings
          </h2>
          <p className="text-muted-foreground">Configure system-wide settings and parameters</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSettings}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={initializeSettings}
          >
            Initialize Defaults
          </Button>
        </div>
      </div>

      {Object.keys(editedSettings).length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
              <AlertCircle className="h-4 w-4" />
              Unsaved Changes
            </CardTitle>
            <CardDescription className="text-yellow-700 dark:text-yellow-300">
              You have {Object.keys(editedSettings).length} unsaved change(s). 
              Click the save button next to each modified setting to save changes.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid w-full grid-cols-auto max-w-fit">
          {categories.map(category => (
            <TabsTrigger 
              key={category} 
              value={category}
              className="capitalize"
            >
              {category === 'all' ? 'All Settings' : category}
              {category !== 'all' && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {settings.filter(s => s.category === category).length}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory} className="space-y-4">
          {filteredSettings.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <div className="text-center">
                  <Settings className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">No settings found</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={initializeSettings}
                    className="mt-2"
                  >
                    Initialize Default Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredSettings.map(renderSettingCard)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};