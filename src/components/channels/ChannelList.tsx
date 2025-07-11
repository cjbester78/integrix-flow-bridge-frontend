import { Card, CardContent } from '@/components/ui/card';
import { ChannelCard } from './ChannelCard';
import { Channel } from './channelData';

interface ChannelListProps {
  channels: Channel[];
}

export const ChannelList = ({ channels }: ChannelListProps) => {
  return (
    <div className="space-y-4">
      {channels.length > 0 ? (
        channels.map((channel) => (
          <ChannelCard key={channel.id} channel={channel} />
        ))
      ) : (
        <Card className="bg-gradient-secondary border-border/50 animate-fade-in">
          <CardContent className="text-center py-12">
            <div className="text-muted-foreground">
              No channels found matching the current filters
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};