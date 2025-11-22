import type { Farm, SensorData, Prediction, HistoricalDataPoint } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getCurrentSensors(): SensorData;
  getLatestPrediction(): Prediction;
  getFarms(): Farm[];
  getHistoricalData(): HistoricalDataPoint[];
  updateSensorData(): void;
}

export class MemStorage implements IStorage {
  private farms: Farm[];
  private currentSensors: SensorData;
  private historicalData: HistoricalDataPoint[];
  private prediction: Prediction;

  constructor() {
    this.farms = this.initializeFarms();
    this.currentSensors = this.generateSensorData();
    this.historicalData = this.generateHistoricalData();
    this.prediction = this.generatePrediction(this.currentSensors);

    setInterval(() => {
      this.updateSensorData();
    }, 5000);
  }

  private initializeFarms(): Farm[] {
    const farmNames = [
      "North Field Alpha",
      "South Valley Beta",
      "East Ridge Gamma",
      "West Plains Delta",
      "Central Grove Epsilon",
      "Highland Zeta",
      "Riverside Eta",
    ];

    return farmNames.map((name, index) => ({
      id: `farm-${index + 1}`,
      name,
      status: this.getRandomStatus(),
      temperature: 18 + Math.random() * 8,
      humidity: 60 + Math.random() * 25,
      lightLevel: 5000 + Math.random() * 10000,
      lastUpdate: new Date().toISOString(),
    }));
  }

  private getRandomStatus(): "healthy" | "warning" | "critical" {
    const rand = Math.random();
    if (rand > 0.75) return "warning";
    if (rand > 0.95) return "critical";
    return "healthy";
  }

  private generateSensorData(): SensorData {
    return {
      temperature: 20 + Math.random() * 6,
      humidity: 65 + Math.random() * 20,
      lightLevel: 8000 + Math.random() * 7000,
      timestamp: new Date().toISOString(),
    };
  }

  private generateHistoricalData(): HistoricalDataPoint[] {
    const data: HistoricalDataPoint[] = [];
    const now = Date.now();
    const points = 24;

    for (let i = points; i >= 0; i--) {
      const timestamp = new Date(now - i * 5 * 60 * 1000);
      const hourOfDay = timestamp.getHours();
      
      const baseTempDay = 24;
      const baseTempNight = 18;
      const tempVariation = hourOfDay >= 6 && hourOfDay <= 18 ? baseTempDay : baseTempNight;
      
      const baseHumidityDay = 60;
      const baseHumidityNight = 75;
      const humidityBase = hourOfDay >= 6 && hourOfDay <= 18 ? baseHumidityDay : baseHumidityNight;

      data.push({
        timestamp: timestamp.toISOString(),
        temperature: tempVariation + Math.random() * 4 - 2,
        humidity: humidityBase + Math.random() * 10 - 5,
      });
    }

    return data;
  }

  private generatePrediction(sensorData: SensorData): Prediction {
    const tempScore = Math.abs(sensorData.temperature - 22) / 10;
    const humidityScore = Math.abs(sensorData.humidity - 70) / 30;
    const lightScore = Math.abs(sensorData.lightLevel - 10000) / 15000;

    const riskScore = (tempScore + humidityScore + lightScore) / 3;

    let riskLevel: "Low" | "Medium" | "High";
    let recommendation: string;

    if (riskScore < 0.3) {
      riskLevel = "Low";
      recommendation = "Conditions are optimal. Continue current monitoring schedule.";
    } else if (riskScore < 0.6) {
      riskLevel = "Medium";
      recommendation = "Monitor closely for signs of fungal growth. Consider adjusting humidity levels.";
    } else {
      riskLevel = "High";
      recommendation = "Immediate action required. Adjust temperature and humidity to prevent disease outbreak.";
    }

    return {
      riskLevel,
      probability: Math.min(riskScore, 0.95),
      timestamp: new Date().toISOString(),
      recommendation,
    };
  }

  getCurrentSensors(): SensorData {
    return this.currentSensors;
  }

  getLatestPrediction(): Prediction {
    return this.prediction;
  }

  getFarms(): Farm[] {
    return this.farms;
  }

  getHistoricalData(): HistoricalDataPoint[] {
    return this.historicalData;
  }

  updateSensorData(): void {
    this.currentSensors = this.generateSensorData();
    this.prediction = this.generatePrediction(this.currentSensors);
    
    this.farms = this.farms.map(farm => ({
      ...farm,
      temperature: farm.temperature + (Math.random() - 0.5) * 0.5,
      humidity: farm.humidity + (Math.random() - 0.5) * 2,
      lightLevel: farm.lightLevel + (Math.random() - 0.5) * 500,
      lastUpdate: new Date().toISOString(),
      status: Math.random() > 0.95 ? this.getRandomStatus() : farm.status,
    }));

    const newDataPoint: HistoricalDataPoint = {
      timestamp: new Date().toISOString(),
      temperature: this.currentSensors.temperature,
      humidity: this.currentSensors.humidity,
    };
    
    this.historicalData.push(newDataPoint);
    if (this.historicalData.length > 30) {
      this.historicalData.shift();
    }
  }
}

export const storage = new MemStorage();
