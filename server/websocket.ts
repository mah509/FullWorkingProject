import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { storage } from './storage';

export function setupWebSocket(httpServer: Server): void {
  const wss = new WebSocketServer({ server: httpServer });

  wss.on('connection', async (ws: WebSocket) => {
    try {
      const initialData = await Promise.all([
        storage.getCurrentSensors(),
        storage.getLatestPrediction(),
        storage.getFarms(),
        storage.getHistoricalData(),
      ]);

      ws.send(JSON.stringify({
        type: 'initial',
        data: {
          sensors: initialData[0],
          prediction: initialData[1],
          farms: initialData[2],
          history: initialData[3],
        },
      }));
    } catch (error) {
      console.error('Error sending initial data:', error);
      ws.close(1011, 'Server error');
      return;
    }

    const updateInterval = setInterval(async () => {
      if (ws.readyState === WebSocket.OPEN) {
        try {
          const sensors = await storage.getCurrentSensors();
          const prediction = await storage.getLatestPrediction();
          const farms = await storage.getFarms();
          const history = await storage.getHistoricalData();

          ws.send(JSON.stringify({
            type: 'update',
            data: {
              sensors,
              prediction,
              farms,
              history,
            },
          }));
        } catch (error) {
          console.error('Error sending update:', error);
        }
      }
    }, 5000);

    ws.on('close', () => {
      clearInterval(updateInterval);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clearInterval(updateInterval);
    });
  });
}
