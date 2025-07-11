import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface DemoUser {
  username: string;
  password: string;
  role: string;
  description: string;
}

const demoUsers: DemoUser[] = [
  {
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    description: 'Full system access and user management'
  },
  {
    username: 'integrator1',
    password: 'integrator123',
    role: 'integrator',
    description: 'Create and manage integrations'
  },
  {
    username: 'viewer1',
    password: 'viewer123',
    role: 'viewer',
    description: 'Read-only access to system data'
  }
];

interface DemoCredentialsProps {
  onSelectUser: (username: string, password: string) => void;
}

export const DemoCredentials: React.FC<DemoCredentialsProps> = ({ onSelectUser }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { toast } = useToast();

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
      toast({
        title: "Copied to clipboard",
        description: `${field} copied successfully`,
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md border-border/50 bg-card/95 backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-lg flex items-center justify-center gap-2">
          <User className="h-5 w-5" />
          Demo Accounts
        </CardTitle>
        <CardDescription>
          Test the system with different user roles
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {demoUsers.map((user, index) => (
          <div
            key={index}
            className="border border-border/50 rounded-lg p-4 space-y-3 hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{user.username}</span>
                  <Badge variant="secondary" className="text-xs">
                    {user.role}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {user.description}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Username</label>
                <div className="flex items-center gap-1">
                  <code className="bg-muted px-2 py-1 rounded text-xs flex-1">
                    {user.username}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(user.username, `${user.username}-username`)}
                    className="h-6 w-6 p-0"
                  >
                    {copiedField === `${user.username}-username` ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Password</label>
                <div className="flex items-center gap-1">
                  <code className="bg-muted px-2 py-1 rounded text-xs flex-1">
                    {user.password}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(user.password, `${user.username}-password`)}
                    className="h-6 w-6 p-0"
                  >
                    {copiedField === `${user.username}-password` ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => onSelectUser(user.username, user.password)}
            >
              Use This Account
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};