import { useQuery } from "@tanstack/react-query";
import { Thermometer, Droplets, Sun, Activity, Wifi, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SensorData, FarmStatus, PredictionResponse, HistoricalDataPoint } from "@shared/schema";
import { SensorCard } from "@/components/sensor-card";
import { PredictionCard } from "@/components/prediction-card";
import { FarmTable } from "@/components/farm-table";
import { TemperatureChart } from "@/components/temperature-chart";
import { SystemOverview } from "@/components/system-overview";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: sensors, isLoading: sensorsLoading, error: sensorsError } = useQuery<SensorData>({
    queryKey: ["/api/sensors"],
    refetchInterval: 5000,
  });

  const { data: prediction, isLoading: predictionLoading, error: predictionError } = useQuery<PredictionResponse>({
    queryKey: ["/api/prediction"],
    refetchInterval: 5000,
  });

  const { data: farms, isLoading: farmsLoading, error: farmsError } = useQuery<FarmStatus[]>({
    queryKey: ["/api/farms"],
    refetchInterval: 5000,
  });

  const { data: history, isLoading: historyLoading, error: historyError } = useQuery<HistoricalDataPoint[]>({
    queryKey: ["/api/history"],
    refetchInterval: 5000,
  });

  const totalFarms = farms?.length || 0;
  const totalSensors = (farms?.length || 0) * 3;
  const avgTemperature = farms ? farms.reduce((sum, f) => sum + f.temperature, 0) / farms.length : undefined;
  const avgHumidity = farms ? farms.reduce((sum, f) => sum + f.humidity, 0) / farms.length : undefined;
  const activeFarms = farms?.filter(f => f.status === "healthy").length || 0;

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-card border-b border-card-border h-16 flex items-center px-4 md:px-8 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center">
            <Activity className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">SmartStrawberry Farms</h1>
            <p className="text-xs text-muted-foreground">Cloud Agriculture Dashboard</p>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {(sensorsError || predictionError || farmsError || historyError) && (
          <Card className="p-4 mb-6 bg-destructive/10 border-destructive/30" data-testid="card-error">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <div>
                <p className="font-semibold text-destructive">Connection Error</p>
                <p className="text-sm text-destructive/80">
                  {sensorsError ? "Failed to load sensor data. " : ""}
                  {predictionError ? "Failed to load predictions. " : ""}
                  {farmsError ? "Failed to load farm data. " : ""}
                  {historyError ? "Failed to load historical data. " : ""}
                  Retrying automatically...
                </p>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-4 hover-elevate" data-testid="card-total-farms">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Total Farms</span>
              <Wifi className="w-4 h-4 text-primary" />
            </div>
            {farmsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-3xl font-bold font-mono text-foreground" data-testid="text-total-farms">{totalFarms}</p>
            )}
          </Card>

          <Card className="p-4 hover-elevate" data-testid="card-active-sensors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Active Sensors</span>
              <Activity className="w-4 h-4 text-primary" />
            </div>
            {farmsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-3xl font-bold font-mono text-foreground" data-testid="text-active-sensors">{totalSensors}</p>
            )}
          </Card>

          <Card className="p-4 hover-elevate" data-testid="card-healthy-farms">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Healthy Farms</span>
              <Activity className="w-4 h-4 text-status-online" />
            </div>
            {farmsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-3xl font-bold font-mono text-foreground" data-testid="text-healthy-farms">{activeFarms}</p>
            )}
          </Card>

          <Card className="p-4 hover-elevate" data-testid="card-system-status">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">System Status</span>
              <div className="w-3 h-3 bg-status-online rounded-full animate-pulse" />
            </div>
            <p className="text-lg font-semibold text-foreground" data-testid="text-system-status">Online</p>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <SensorCard
                icon={<Thermometer className="w-5 h-5 text-chart-1" />}
                label="Temperature"
                value={sensors?.temperature}
                unit="°C"
                isLoading={sensorsLoading}
                testId="sensor-temperature"
              />
              <SensorCard
                icon={<Droplets className="w-5 h-5 text-chart-2" />}
                label="Humidity"
                value={sensors?.humidity}
                unit="%"
                isLoading={sensorsLoading}
                testId="sensor-humidity"
              />
              <SensorCard
                icon={<Sun className="w-5 h-5 text-chart-3" />}
                label="Light Level"
                value={sensors?.lightLevel}
                unit="lux"
                isLoading={sensorsLoading}
                testId="sensor-light"
              />
              <SensorCard
                icon={<Activity className="w-5 h-5 text-chart-4" />}
                label="Avg. Temp"
                value={avgTemperature}
                unit="°C"
                isLoading={farmsLoading}
                testId="sensor-avg-temp"
              />
            </div>

            <TemperatureChart history={history || []} isLoading={historyLoading} error={historyError} />

            <FarmTable farms={farms || []} isLoading={farmsLoading} />
          </div>

          <div className="space-y-6">
            <PredictionCard prediction={prediction} isLoading={predictionLoading} />
            <SystemOverview />
          </div>
        </div>
      </div>

      <footer className="border-t border-border h-16 flex items-center justify-center mt-12">
        <div className="text-center">
          <p className="text-sm text-foreground font-medium">Powered by Cloud Architecture & ML Simulation</p>
          <p className="text-xs text-muted-foreground mt-1">Academic Project - SmartStrawberry Farms</p>
        </div>
      </footer>
    </div>
  );
}
