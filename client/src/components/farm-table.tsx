import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Farm } from "@shared/schema";

interface FarmTableProps {
  farms: Farm[];
  isLoading: boolean;
}

export function FarmTable({ farms, isLoading }: FarmTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-status-online";
      case "warning":
        return "bg-status-away";
      case "critical":
        return "bg-status-busy";
      default:
        return "bg-status-offline";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Card className="p-6" data-testid="card-farm-table">
      <h3 className="text-lg font-semibold text-foreground mb-4">Farm Status Overview</h3>
      
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(7)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Farm Name</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold text-right">Temperature</TableHead>
                <TableHead className="font-semibold text-right">Humidity</TableHead>
                <TableHead className="font-semibold">Last Update</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {farms.map((farm) => (
                <TableRow key={farm.id} className="hover-elevate" data-testid={`row-farm-${farm.id}`}>
                  <TableCell className="font-medium text-foreground" data-testid={`text-farm-name-${farm.id}`}>
                    {farm.name}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(farm.status)}`} />
                      <span className="text-sm text-foreground" data-testid={`text-status-${farm.id}`}>
                        {getStatusLabel(farm.status)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-foreground" data-testid={`text-temp-${farm.id}`}>
                    {farm.temperature.toFixed(1)}°C
                  </TableCell>
                  <TableCell className="text-right font-mono text-foreground" data-testid={`text-humidity-${farm.id}`}>
                    {farm.humidity.toFixed(1)}%
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground" data-testid={`text-update-${farm.id}`}>
                    {new Date(farm.lastUpdate).toLocaleTimeString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  );
}
