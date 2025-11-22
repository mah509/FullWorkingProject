import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useRef } from "react";
import type { HistoricalDataPoint } from "@shared/schema";

interface TemperatureChartProps {
  history: HistoricalDataPoint[];
  isLoading: boolean;
  error?: Error | null;
}

declare global {
  interface Window {
    Chart: any;
  }
}

export function TemperatureChart({ history, isLoading, error }: TemperatureChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (!canvasRef.current || isLoading || !history.length || !window.Chart) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const labels = history.map(d => new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    const temperatureData = history.map(d => d.temperature);
    const humidityData = history.map(d => d.humidity);

    chartRef.current = new window.Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Temperature (°C)',
            data: temperatureData,
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            tension: 0.4,
            fill: true,
          },
          {
            label: 'Humidity (%)',
            data: humidityData,
            borderColor: 'rgb(245, 158, 11)',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              boxWidth: 12,
              boxHeight: 12,
              padding: 15,
              font: {
                family: 'Inter',
                size: 13,
              },
            },
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            bodySpacing: 6,
            titleFont: {
              size: 13,
              family: 'Inter',
            },
            bodyFont: {
              size: 12,
              family: 'Roboto Mono',
            },
          },
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
            },
            ticks: {
              font: {
                size: 11,
                family: 'Inter',
              },
            },
          },
          y: {
            beginAtZero: false,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
            },
            ticks: {
              font: {
                size: 11,
                family: 'Roboto Mono',
              },
            },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [history, isLoading]);

  return (
    <Card className="p-6" data-testid="card-temperature-chart">
      <h3 className="text-lg font-semibold text-foreground mb-4">Temperature & Humidity Trends</h3>
      
      {isLoading ? (
        <Skeleton className="h-64 md:h-80 w-full" />
      ) : (
        <div className="h-64 md:h-80">
          <canvas ref={canvasRef} data-testid="canvas-chart" />
        </div>
      )}
    </Card>
  );
}
