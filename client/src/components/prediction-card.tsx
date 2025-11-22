import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, XCircle, Activity } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Prediction } from "@shared/schema";

interface PredictionCardProps {
  prediction: Prediction | undefined;
  isLoading: boolean;
}

export function PredictionCard({ prediction, isLoading }: PredictionCardProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case "Low":
        return "bg-status-online text-white";
      case "Medium":
        return "bg-status-away text-white";
      case "High":
        return "bg-status-busy text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "Low":
        return <CheckCircle className="w-4 h-4" />;
      case "Medium":
        return <AlertTriangle className="w-4 h-4" />;
      case "High":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <Card className="p-6 hover-elevate" data-testid="card-prediction">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">ML Prediction</h3>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : prediction ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Badge className={`${getRiskColor(prediction.riskLevel)} px-4 py-2 text-sm font-bold uppercase flex items-center gap-2`} data-testid="badge-risk-level">
              {getRiskIcon(prediction.riskLevel)}
              {prediction.riskLevel} Risk
            </Badge>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Disease Probability</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold font-mono text-foreground" data-testid="text-probability">
                {(prediction.probability * 100).toFixed(1)}
              </span>
              <span className="text-xl font-medium text-muted-foreground">%</span>
            </div>
          </div>

          <div className="p-4 bg-accent/30 rounded-md border border-accent-border">
            <p className="text-sm font-medium text-accent-foreground mb-1">Recommendation</p>
            <p className="text-sm text-foreground" data-testid="text-recommendation">{prediction.recommendation}</p>
          </div>

          <p className="text-xs text-muted-foreground" data-testid="text-prediction-timestamp">
            Last updated: {new Date(prediction.timestamp).toLocaleString()}
          </p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No prediction data available</p>
      )}
    </Card>
  );
}
