import { z } from "zod";

export const sensorDataSchema = z.object({
  temperature: z.number(),
  humidity: z.number(),
  lightLevel: z.number(),
  timestamp: z.string(),
});

export const farmSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(["healthy", "warning", "critical"]),
  temperature: z.number(),
  humidity: z.number(),
  lightLevel: z.number(),
  lastUpdate: z.string(),
});

export const predictionSchema = z.object({
  riskLevel: z.enum(["Low", "Medium", "High"]),
  probability: z.number().min(0).max(1),
  timestamp: z.string(),
  recommendation: z.string(),
});

export const historicalDataPointSchema = z.object({
  timestamp: z.string(),
  temperature: z.number(),
  humidity: z.number(),
});

export type SensorData = z.infer<typeof sensorDataSchema>;
export type Farm = z.infer<typeof farmSchema>;
export type Prediction = z.infer<typeof predictionSchema>;
export type HistoricalDataPoint = z.infer<typeof historicalDataPointSchema>;
