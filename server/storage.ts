import type { SensorData, FarmStatus, PredictionResponse, HistoricalDataPoint } from "@shared/schema";
import { farms, sensorReadings, predictions } from "@shared/schema";
import { db } from "./db";
import { desc, eq, sql } from "drizzle-orm";

export interface IStorage {
  getCurrentSensors(): Promise<SensorData>;
  getLatestPrediction(): Promise<PredictionResponse>;
  getFarms(): Promise<FarmStatus[]>;
  getHistoricalData(): Promise<HistoricalDataPoint[]>;
  updateSensorData(): Promise<void>;
  initialize(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  private initialized = false;
  private updateInterval: NodeJS.Timeout | null = null;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    const existingFarms = await db.select().from(farms);
    
    if (existingFarms.length === 0) {
      const farmNames = [
        "North Field Alpha",
        "South Valley Beta",
        "East Ridge Gamma",
        "West Plains Delta",
        "Central Grove Epsilon",
        "Highland Zeta",
        "Riverside Eta",
      ];

      for (let i = 0; i < farmNames.length; i++) {
        await db.insert(farms).values({
          farmId: `farm-${i + 1}`,
          name: farmNames[i],
          status: "healthy",
        });

        await db.insert(sensorReadings).values({
          farmId: `farm-${i + 1}`,
          temperature: String(18 + Math.random() * 8),
          humidity: String(60 + Math.random() * 25),
          lightLevel: String(5000 + Math.random() * 10000),
        });
      }

      await this.generateHistoricalData();
      
      const sensors = await this.getCurrentSensors();
      const pred = this.generatePrediction(sensors);
      await db.insert(predictions).values({
        farmId: null,
        riskLevel: pred.riskLevel,
        probability: String(pred.probability),
        recommendation: pred.recommendation,
      });
    }

    if (!this.updateInterval) {
      this.updateInterval = setInterval(async () => {
        await this.updateSensorData();
      }, 5000);
    }

    this.initialized = true;
  }

  private async generateHistoricalData(): Promise<void> {
    const now = Date.now();
    const points = 24;
    const farmIds = ["farm-1", "farm-2", "farm-3", "farm-4", "farm-5", "farm-6", "farm-7"];

    for (let i = points; i >= 0; i--) {
      const timestamp = new Date(now - i * 5 * 60 * 1000);
      const hourOfDay = timestamp.getHours();
      
      const baseTempDay = 24;
      const baseTempNight = 18;
      const tempVariation = hourOfDay >= 6 && hourOfDay <= 18 ? baseTempDay : baseTempNight;
      
      const baseHumidityDay = 60;
      const baseHumidityNight = 75;
      const humidityBase = hourOfDay >= 6 && hourOfDay <= 18 ? baseHumidityDay : baseHumidityNight;

      for (const farmId of farmIds) {
        await db.insert(sensorReadings).values({
          farmId,
          temperature: String(tempVariation + Math.random() * 4 - 2),
          humidity: String(humidityBase + Math.random() * 10 - 5),
          lightLevel: String(10000 + Math.random() * 5000),
        });
      }
    }
  }

  private getRandomStatus(): "healthy" | "warning" | "critical" {
    const rand = Math.random();
    if (rand > 0.95) return "critical";
    if (rand > 0.85) return "warning";
    return "healthy";
  }

  private generatePrediction(sensorData: SensorData): { riskLevel: "Low" | "Medium" | "High"; probability: number; recommendation: string } {
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
      recommendation,
    };
  }

  async getCurrentSensors(): Promise<SensorData> {
    const latestReading = await db
      .select()
      .from(sensorReadings)
      .orderBy(desc(sensorReadings.timestamp))
      .limit(1);

    if (latestReading.length === 0) {
      return {
        temperature: 22,
        humidity: 70,
        lightLevel: 10000,
        timestamp: new Date().toISOString(),
      };
    }

    const reading = latestReading[0];
    return {
      temperature: parseFloat(reading.temperature),
      humidity: parseFloat(reading.humidity),
      lightLevel: parseFloat(reading.lightLevel),
      timestamp: reading.timestamp.toISOString(),
    };
  }

  async getLatestPrediction(): Promise<PredictionResponse> {
    const latestPrediction = await db
      .select()
      .from(predictions)
      .orderBy(desc(predictions.timestamp))
      .limit(1);

    if (latestPrediction.length === 0) {
      const sensors = await this.getCurrentSensors();
      const pred = this.generatePrediction(sensors);
      
      await db.insert(predictions).values({
        farmId: null,
        riskLevel: pred.riskLevel,
        probability: String(pred.probability),
        recommendation: pred.recommendation,
      });

      return {
        riskLevel: pred.riskLevel,
        probability: pred.probability,
        timestamp: new Date().toISOString(),
        recommendation: pred.recommendation,
      };
    }

    const pred = latestPrediction[0];
    return {
      riskLevel: pred.riskLevel as "Low" | "Medium" | "High",
      probability: parseFloat(pred.probability),
      timestamp: pred.timestamp.toISOString(),
      recommendation: pred.recommendation,
    };
  }

  async getFarms(): Promise<FarmStatus[]> {
    const farmList = await db.select().from(farms);
    const farmStatuses: FarmStatus[] = [];

    for (const farm of farmList) {
      const latestReading = await db
        .select()
        .from(sensorReadings)
        .where(eq(sensorReadings.farmId, farm.farmId))
        .orderBy(desc(sensorReadings.timestamp))
        .limit(1);

      if (latestReading.length > 0) {
        const reading = latestReading[0];
        farmStatuses.push({
          id: farm.farmId,
          name: farm.name,
          status: farm.status as "healthy" | "warning" | "critical",
          temperature: parseFloat(reading.temperature),
          humidity: parseFloat(reading.humidity),
          lightLevel: parseFloat(reading.lightLevel),
          lastUpdate: reading.timestamp.toISOString(),
        });
      }
    }

    return farmStatuses;
  }

  async getHistoricalData(): Promise<HistoricalDataPoint[]> {
    const readings = await db
      .select()
      .from(sensorReadings)
      .where(eq(sensorReadings.farmId, "farm-1"))
      .orderBy(desc(sensorReadings.timestamp))
      .limit(30);

    return readings.reverse().map(reading => ({
      timestamp: reading.timestamp.toISOString(),
      temperature: parseFloat(reading.temperature),
      humidity: parseFloat(reading.humidity),
    }));
  }

  async updateSensorData(): Promise<void> {
    const farmList = await db.select().from(farms);

    for (const farm of farmList) {
      const latestReading = await db
        .select()
        .from(sensorReadings)
        .where(eq(sensorReadings.farmId, farm.farmId))
        .orderBy(desc(sensorReadings.timestamp))
        .limit(1);

      let newTemp = 20 + Math.random() * 6;
      let newHumidity = 65 + Math.random() * 20;
      let newLight = 8000 + Math.random() * 7000;

      if (latestReading.length > 0) {
        const reading = latestReading[0];
        newTemp = parseFloat(reading.temperature) + (Math.random() - 0.5) * 0.5;
        newHumidity = parseFloat(reading.humidity) + (Math.random() - 0.5) * 2;
        newLight = parseFloat(reading.lightLevel) + (Math.random() - 0.5) * 500;
      }

      await db.insert(sensorReadings).values({
        farmId: farm.farmId,
        temperature: String(newTemp),
        humidity: String(newHumidity),
        lightLevel: String(newLight),
      });

      if (Math.random() > 0.95) {
        await db
          .update(farms)
          .set({ status: this.getRandomStatus() })
          .where(eq(farms.farmId, farm.farmId));
      }
    }

    const sensors = await this.getCurrentSensors();
    const pred = this.generatePrediction(sensors);
    
    await db.insert(predictions).values({
      farmId: null,
      riskLevel: pred.riskLevel,
      probability: String(pred.probability),
      recommendation: pred.recommendation,
    });
  }
}

export const storage = new DatabaseStorage();
