import { Card } from "@/components/ui/card";
import { Cloud, Cpu, TrendingUp, Wifi } from "lucide-react";

export function SystemOverview() {
  const steps = [
    {
      icon: <Wifi className="w-6 h-6 text-chart-1" />,
      title: "Data Collection",
      description: "IoT sensors monitor temperature, humidity, and light levels across 7 strawberry farms in real-time.",
    },
    {
      icon: <Cloud className="w-6 h-6 text-chart-2" />,
      title: "Cloud Processing",
      description: "Sensor data is transmitted to cloud infrastructure for aggregation, storage, and analysis.",
    },
    {
      icon: <Cpu className="w-6 h-6 text-chart-3" />,
      title: "ML Prediction",
      description: "Machine learning algorithms analyze patterns to predict disease risk and provide actionable recommendations.",
    },
  ];

  return (
    <Card className="p-8" data-testid="card-system-overview">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">System Overview</h3>
      </div>

      <div className="space-y-6">
        {steps.map((step, index) => (
          <div key={index} className="relative" data-testid={`overview-step-${index}`}>
            {index < steps.length - 1 && (
              <div className="absolute left-[19px] top-12 w-0.5 h-12 bg-border" />
            )}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-accent rounded-md flex items-center justify-center">
                {step.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-1">{step.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-primary/10 rounded-md border border-primary/20">
        <p className="text-sm text-foreground">
          <span className="font-semibold">Academic Note:</span> This dashboard demonstrates a cloud-based smart farming architecture with simulated ML predictions for educational purposes.
        </p>
      </div>
    </Card>
  );
}
