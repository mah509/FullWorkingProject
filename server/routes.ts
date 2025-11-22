import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  await storage.initialize();

  app.get("/api/sensors", async (req, res) => {
    try {
      const sensors = await storage.getCurrentSensors();
      res.json(sensors);
    } catch (error) {
      console.error("Error fetching sensors:", error);
      res.status(500).json({ error: "Failed to fetch sensor data" });
    }
  });

  app.get("/api/prediction", async (req, res) => {
    try {
      const prediction = await storage.getLatestPrediction();
      res.json(prediction);
    } catch (error) {
      console.error("Error fetching prediction:", error);
      res.status(500).json({ error: "Failed to fetch prediction" });
    }
  });

  app.get("/api/farms", async (req, res) => {
    try {
      const farms = await storage.getFarms();
      res.json(farms);
    } catch (error) {
      console.error("Error fetching farms:", error);
      res.status(500).json({ error: "Failed to fetch farms data" });
    }
  });

  app.get("/api/history", async (req, res) => {
    try {
      const history = await storage.getHistoricalData();
      res.json(history);
    } catch (error) {
      console.error("Error fetching historical data:", error);
      res.status(500).json({ error: "Failed to fetch historical data" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
