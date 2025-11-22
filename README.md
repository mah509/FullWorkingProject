# SmartStrawberry Farms - Cloud-Based Agriculture Dashboard

A comprehensive cloud-based smart farming system demonstrating IoT sensor monitoring, real-time data visualization, and ML-powered disease prediction for strawberry farm management.

## 🌟 Features

- **Real-Time Monitoring**: Track temperature, humidity, and light levels across 7 strawberry farms
- **ML Disease Prediction**: Simulated machine learning algorithm provides risk assessment (Low/Medium/High) with actionable recommendations
- **Live Data Visualization**: Interactive Chart.js graphs showing temperature and humidity trends over time
- **Farm Status Dashboard**: Color-coded status indicators (green/yellow/red) for each farm
- **Auto-Refresh**: All data updates automatically every 5 seconds
- **Responsive Design**: Beautiful, mobile-friendly interface built with React, TypeScript, and Tailwind CSS
- **Error Handling**: Graceful error states with automatic retry on API failures

## 🏗️ System Architecture

```
┌─────────────────┐      ┌──────────────┐      ┌─────────────────┐
│  IoT Sensors    │ ───> │   Cloud API  │ ───> │  ML Prediction  │
│  (Simulated)    │      │   Express.js │      │   Engine        │
└─────────────────┘      └──────────────┘      └─────────────────┘
                                │
                                │
                         ┌──────▼───────┐
                         │   Dashboard  │
                         │   React + TS │
                         └──────────────┘
```

## 📋 Prerequisites

- Node.js 20.x or higher
- npm or yarn package manager

## 🚀 Getting Started

### Running Locally

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Application**
   ```bash
   npm run dev
   ```
   
   This starts both the backend (Express) and frontend (Vite) on port 5000.

3. **Access the Dashboard**
   ```
   Open your browser to: http://localhost:5000
   ```

The dashboard will automatically:
- Load current sensor data from all 7 farms
- Display ML disease risk predictions
- Show historical temperature/humidity charts
- Update all data every 5 seconds

## 📁 Project Structure

```
project/
├── client/                      # Frontend React application
│   ├── src/
│   │   ├── pages/
│   │   │   └── dashboard.tsx   # Main dashboard page
│   │   ├── components/
│   │   │   ├── sensor-card.tsx          # Sensor value display
│   │   │   ├── prediction-card.tsx      # ML prediction display
│   │   │   ├── farm-table.tsx           # Farm status table
│   │   │   ├── temperature-chart.tsx    # Chart.js visualization
│   │   │   └── system-overview.tsx      # Architecture overview
│   │   └── index.css           # Tailwind styles and design tokens
│   └── index.html              # HTML entry point with Chart.js CDN
├── server/
│   ├── routes.ts               # API endpoints
│   ├── storage.ts              # In-memory data storage and simulation
│   └── app.ts                  # Express server configuration
├── shared/
│   └── schema.ts               # TypeScript types and Zod schemas
└── README.md                   # This file
```

## 🔌 API Endpoints

All endpoints return JSON and are polled every 5 seconds by the frontend:

### `GET /api/sensors`
Returns current sensor readings:
```json
{
  "temperature": 23.5,
  "humidity": 72.3,
  "lightLevel": 12500,
  "timestamp": "2025-11-22T12:34:56.789Z"
}
```

### `GET /api/prediction`
Returns ML disease risk prediction:
```json
{
  "riskLevel": "Low",
  "probability": 0.15,
  "timestamp": "2025-11-22T12:34:56.789Z",
  "recommendation": "Conditions are optimal. Continue current monitoring schedule."
}
```

### `GET /api/farms`
Returns array of 7 farms with status:
```json
[
  {
    "id": "farm-1",
    "name": "North Field Alpha",
    "status": "healthy",
    "temperature": 22.1,
    "humidity": 68.5,
    "lightLevel": 11200,
    "lastUpdate": "2025-11-22T12:34:56.789Z"
  },
  // ... 6 more farms
]
```

### `GET /api/history`
Returns historical data points for chart visualization:
```json
[
  {
    "timestamp": "2025-11-22T10:00:00.000Z",
    "temperature": 21.5,
    "humidity": 70.2
  },
  // ... more data points
]
```

## 🤖 ML Prediction Algorithm

The system uses a simulated ML algorithm that calculates disease risk based on:

1. **Temperature Score**: Deviation from optimal 22°C
2. **Humidity Score**: Deviation from optimal 70%
3. **Light Score**: Deviation from optimal 10,000 lux

**Risk Levels:**
- **Low** (0-30% risk): Optimal conditions, continue monitoring
- **Medium** (30-60% risk): Monitor closely, consider adjustments
- **High** (60%+ risk): Immediate action required

The backend automatically updates predictions every 5 seconds based on current sensor readings.

## 🌐 Deployment

### Deploy Frontend to Netlify

1. **Build the Frontend**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Connect your Git repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Deploy!

   Or use Netlify CLI:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

### Deploy Backend to Replit Deployments

The backend is already configured for Replit Deployments:

1. Click "Deploy" in the Replit interface
2. The application will automatically deploy with:
   - Backend serving API endpoints
   - Frontend serving static files
   - Auto-scaling and health checks

### Deploy Backend to AWS

1. **Using AWS Elastic Beanstalk**
   ```bash
   # Install EB CLI
   pip install awsebcli

   # Initialize application
   eb init -p node.js smartstrawberry-api

   # Create environment and deploy
   eb create production
   eb deploy
   ```

2. **Using AWS EC2**
   ```bash
   # SSH into your EC2 instance
   ssh -i your-key.pem ec2-user@your-instance

   # Clone repository and install
   git clone <your-repo>
   cd smartstrawberry-farms
   npm install
   npm run dev

   # Use PM2 for process management
   npm install -g pm2
   pm2 start "npm run dev" --name smartstrawberry
   pm2 save
   pm2 startup
   ```

3. **Environment Variables**
   Set `PORT=5000` (or your preferred port)
   No other environment variables required for basic deployment.

## 🎨 Design System

- **Fonts**: Inter (UI text), Roboto Mono (numerical data)
- **Colors**: 
  - Primary: Green (#22C55E)
  - Status: Green (healthy), Yellow (warning), Red (critical)
- **Components**: shadcn/ui with Tailwind CSS
- **Spacing**: Consistent 4px/8px/16px/24px scale

## 📊 Data Simulation

The backend simulates realistic farm data:

- **Sensor Updates**: Every 5 seconds
- **Temperature**: 18-26°C with realistic day/night variation
- **Humidity**: 60-85% with inverse correlation to temperature
- **Light Levels**: 5,000-15,000 lux
- **Farm Status**: Randomly changes based on conditions (95% healthy, 4% warning, 1% critical)

## 🧪 Testing

The application includes comprehensive end-to-end tests covering:
- Dashboard loading and navigation
- Real-time sensor data display
- ML prediction accuracy
- Farm status table rendering
- Chart visualization
- Error handling and recovery
- Responsive design

All tests pass successfully, verifying the complete user journey from data collection to visualization.

## 📝 Academic Note

This project was developed as an academic demonstration of:
- Cloud-based IoT architecture
- Real-time data visualization
- Machine learning integration in agriculture
- Full-stack TypeScript development
- Modern web application patterns

**Note**: The ML predictions are simulated for educational purposes. In a production system, this would connect to a trained model using TensorFlow.js, PyTorch, or cloud ML services.

## 🛠️ Tech Stack

**Frontend:**
- React 18 with TypeScript
- TailwindCSS + shadcn/ui components
- Chart.js for data visualization
- React Query for data fetching and caching
- Wouter for routing

**Backend:**
- Node.js + Express
- In-memory data storage (MemStorage)
- Simulated ML prediction engine
- RESTful API design

**Deployment:**
- Replit Deployments (recommended)
- Netlify (frontend)
- AWS Elastic Beanstalk / EC2 (backend)

## 📄 License

This is an academic project created for educational purposes.

## 🙏 Acknowledgments

- Design inspired by modern agriculture technology dashboards
- ML simulation based on common strawberry disease risk factors
- Built with love for sustainable farming technology

---

**Powered by Cloud Architecture & ML Simulation**  
*SmartStrawberry Farms - Making Agriculture Smarter*
