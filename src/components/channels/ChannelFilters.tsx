import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ChannelFiltersProps {
  selectedStatus: string | null;
  onStatusChange: (status: string | null) => void;
}

export function ChannelFilters({ selectedStatus, onStatusChange }: ChannelFiltersProps) {
  const statuses = [
    { value: null, label: 'All', color: 'bg-gray-100' },
    { value: 'active', label: 'Active', color: 'bg-green-100' },
    { value: 'running', label: 'Running', color: 'bg-blue-100' },
    { value: 'stopped', label: 'Stopped', color: 'bg-yellow-100' },
    { value: 'error', label: 'Error', color: 'bg-red-100' },
  ];

  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold mb-3">Filter by Status</h3>
      <div className="flex gap-2 flex-wrap">
        {statuses.map((status) => (
          <Button
            key={status.value || 'all'}
            variant={selectedStatus === status.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onStatusChange(status.value)}
            className={selectedStatus !== status.value ? status.color : ''}
          >
            {status.label}
          </Button>
        ))}
      </div>
    </Card>
  );
}