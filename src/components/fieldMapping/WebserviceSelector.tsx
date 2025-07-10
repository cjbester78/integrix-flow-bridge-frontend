import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Settings } from 'lucide-react';
import { demoWebservices } from './demoData';

interface WebserviceSelectorProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedService: string;
  onSelectService: (service: string) => void;
  title: string;
}

export function WebserviceSelector({ 
  isOpen, 
  onOpenChange, 
  selectedService, 
  onSelectService, 
  title 
}: WebserviceSelectorProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Select
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button variant="outline" className="bg-primary/10 border-primary">Local Resources</Button>
            <Button variant="outline">Global Resources</Button>
          </div>
          <p className="text-sm text-muted-foreground">
            List of demo webservice files available for mapping.
          </p>
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
            <Input placeholder="Search" className="pl-10" />
          </div>
          <div className="border rounded-md p-3 space-y-2">
            {demoWebservices.map(service => (
              <div 
                key={service}
                className={`p-2 rounded text-sm cursor-pointer transition-colors ${
                  selectedService === service 
                    ? 'bg-primary/10 border border-primary' 
                    : 'hover:bg-muted'
                }`}
                onClick={() => onSelectService(service)}
              >
                {service}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}