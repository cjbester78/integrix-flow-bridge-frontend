import { Card, CardContent } from '@/components/ui/card';
import { ChannelCard } from './ChannelCard';
import { Channel } from './channelData';
import { Customer } from '@/types/customer';

interface ChannelListProps {
  selectedCustomer: Customer | null;
  customerChannels: Channel[];
}

export const ChannelList = ({ selectedCustomer, customerChannels }: ChannelListProps) => {
  return (
    <div className="space-y-4">
      {selectedCustomer && customerChannels.length > 0 ? (
        customerChannels.map((channel) => (
          <ChannelCard key={channel.id} channel={channel} />
        ))
      ) : (
        <Card className="bg-gradient-secondary border-border/50 animate-fade-in">
          <CardContent className="text-center py-12">
            <div className="text-muted-foreground">
              {selectedCustomer ? 'No channels found for this customer' : 'Select a customer to view their channels'}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};