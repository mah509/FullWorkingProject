import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface SensorCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | undefined;
  unit: string;
  isLoading: boolean;
  testId: string;
}

export function SensorCard({ icon, label, value, unit, isLoading, testId }: SensorCardProps) {
  return (
    <Card className="p-4 relative hover-elevate" data-testid={`card-${testId}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 bg-accent/50 rounded-md">
          {icon}
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {isLoading || value === undefined ? (
          <Skeleton className="h-9 w-20" />
        ) : (
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold font-mono text-foreground" data-testid={`text-${testId}-value`}>
              {value.toFixed(1)}
            </span>
            <span className="text-sm font-medium text-muted-foreground">{unit}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
