import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageFilters } from '@/types/message';
import { Search, Filter, X, Calendar } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface MessageFiltersProps {
  filters: MessageFilters;
  onFiltersChange: (filters: MessageFilters) => void;
  onSearch: (query: string) => void;
  onClearFilters: () => void;
}

export const MessageFiltersComponent = ({ 
  filters, 
  onFiltersChange, 
  onSearch,
  onClearFilters 
}: MessageFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleFilterChange = (key: keyof MessageFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearDateRange = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    onFiltersChange({
      ...filters,
      startDate: undefined,
      endDate: undefined,
    });
  };

  const applyDateRange = () => {
    onFiltersChange({
      ...filters,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== null && 
    (Array.isArray(value) ? value.length > 0 : true)
  );

  return (
    <Card className="bg-gradient-secondary border-border/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters & Search
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="ml-auto"
            >
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages, logs, metadata..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit" variant="outline">
            Search
          </Button>
        </form>

        {/* Filter Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select 
              value={filters.status?.[0] || 'all'} 
              onValueChange={(value) => handleFilterChange('status', value === 'all' ? undefined : [value])}
            >
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="retrying">Retrying</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Priority</label>
            <Select 
              value={filters.priority?.[0] || 'all'} 
              onValueChange={(value) => handleFilterChange('priority', value === 'all' ? undefined : [value])}
            >
              <SelectTrigger>
                <SelectValue placeholder="All priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Message Type</label>
            <Input
              placeholder="e.g., Customer Update"
              value={filters.messageType || ''}
              onChange={(e) => handleFilterChange('messageType', e.target.value || undefined)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Sort By</label>
            <Select 
              value={filters.sortBy || 'timestamp'} 
              onValueChange={(value) => handleFilterChange('sortBy', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="timestamp">Timestamp</SelectItem>
                <SelectItem value="processingTime">Processing Time</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filter Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Date Range</label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      'flex-1 justify-start text-left font-normal',
                      !startDate && 'text-muted-foreground'
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'MMM d') : 'Start date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      'flex-1 justify-start text-left font-normal',
                      !endDate && 'text-muted-foreground'
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'MMM d') : 'End date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>

              {(startDate || endDate) && (
                <Button variant="ghost" size="sm" onClick={clearDateRange}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            {(startDate && endDate) && (
              <Button variant="outline" size="sm" onClick={applyDateRange} className="w-full">
                Apply Date Range
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Correlation ID</label>
            <Input
              placeholder="Filter by correlation ID"
              value={filters.correlationId || ''}
              onChange={(e) => handleFilterChange('correlationId', e.target.value || undefined)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Business Key</label>
            <Input
              placeholder="Filter by business key"
              value={filters.businessKey || ''}
              onChange={(e) => handleFilterChange('businessKey', e.target.value || undefined)}
            />
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
            {filters.status && (
              <Badge variant="secondary">
                Status: {filters.status.join(', ')}
                <X 
                  className="ml-1 h-3 w-3 cursor-pointer" 
                  onClick={() => handleFilterChange('status', undefined)}
                />
              </Badge>
            )}
            {filters.priority && (
              <Badge variant="secondary">
                Priority: {filters.priority.join(', ')}
                <X 
                  className="ml-1 h-3 w-3 cursor-pointer" 
                  onClick={() => handleFilterChange('priority', undefined)}
                />
              </Badge>
            )}
            {filters.messageType && (
              <Badge variant="secondary">
                Type: {filters.messageType}
                <X 
                  className="ml-1 h-3 w-3 cursor-pointer" 
                  onClick={() => handleFilterChange('messageType', undefined)}
                />
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};