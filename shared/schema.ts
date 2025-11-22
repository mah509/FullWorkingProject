import { z } from "zod";
import { pgTable, serial, varchar, decimal, timestamp, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const farms = pgTable("farms", {
  id: serial("id").primaryKey(),
  farmId: varchar("farm_id", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("healthy"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sensorReadings = pgTable("sensor_readings", {
  id: serial("id").primaryKey(),
  farmId: varchar("farm_id", { length: 50 }).notNull(),
  temperature: decimal("temperature", { precision: 5, scale: 2 }).notNull(),
  humidity: decimal("humidity", { precision: 5, scale: 2 }).notNull(),
  lightLevel: decimal("light_level", { precision: 10, scale: 2 }).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const predictions = pgTable("predictions", {
  id: serial("id").primaryKey(),
  farmId: varchar("farm_id", { length: 50 }),
  riskLevel: varchar("risk_level", { length: 20 }).notNull(),
  probability: decimal("probability", { precision: 5, scale: 4 }).notNull(),
  recommendation: text("recommendation").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertFarmSchema = createInsertSchema(farms).omit({
  id: true,
  createdAt: true,
});
export const insertSensorReadingSchema = createInsertSchema(sensorReadings).omit({
  id: true,
  timestamp: true,
});
export const insertPredictionSchema = createInsertSchema(predictions).omit({
  id: true,
  timestamp: true,
});

export type Farm = typeof farms.$inferSelect;
export type InsertFarm = z.infer<typeof insertFarmSchema>;
export type SensorReading = typeof sensorReadings.$inferSelect;
export type InsertSensorReading = z.infer<typeof insertSensorReadingSchema>;
export type Prediction = typeof predictions.$inferSelect;
export type InsertPrediction = z.infer<typeof insertPredictionSchema>;

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
export type FarmStatus = z.infer<typeof farmSchema>;
export type PredictionResponse = z.infer<typeof predictionSchema>;
export type HistoricalDataPoint = z.infer<typeof historicalDataPointSchema>;
