import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Shield, ArrowRight, KeyRound, User } from 'lucide-react';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const { toast } = useToast();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const success = await login(username, password);
    
    if (!success) {
      toast({
        title: "Login Failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const handleDemoLogin = () => {
    setUsername('admin');
    setPassword('password');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-secondary relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <Card className="w-full max-w-md shadow-elegant animate-scale-in relative z-10 border-border/50 bg-card/95 backdrop-blur-sm">
        <CardHeader className="text-center space-y-6 animate-fade-in">
          <div className="flex items-center justify-center">
            <div className="h-16 w-16 rounded-2xl bg-gradient-primary flex items-center justify-center animate-glow">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              IntegrixLab
            </CardTitle>
            <CardDescription className="text-base">
              Enterprise Integration Platform
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="transition-all duration-300 focus:scale-[1.02] focus:shadow-elegant"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                <KeyRound className="h-4 w-4" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="transition-all duration-300 focus:scale-[1.02] focus:shadow-elegant"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-300 hover:scale-[1.02] hover:shadow-elegant group"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Demo Access</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full transition-all duration-300 hover:scale-[1.02] hover:bg-accent/50"
              onClick={handleDemoLogin}
            >
              Use Demo Credentials
            </Button>
            
            <div className="bg-muted/30 rounded-lg p-4 text-center space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Demo Credentials:</div>
              <div className="text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Username:</span>
                  <code className="bg-muted px-2 py-1 rounded text-foreground">admin</code>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Password:</span>
                  <code className="bg-muted px-2 py-1 rounded text-foreground">password</code>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};