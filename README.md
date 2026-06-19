# 🛡️ CyberShield AI - Intelligent Security Log Analyzer

A complete, production-ready AI-powered cybersecurity platform that analyzes security logs, detects threats, and provides actionable recommendations. Built with FastAPI, React, TypeScript, Tailwind CSS, and Scikit-learn.

## ✨ Features

### 🔐 Authentication
- User registration and login
- JWT-based authentication
- Protected routes
- Password hashing with bcrypt

### 📝 Log Management
- Upload log files
- Paste raw logs
- Generate sample security logs
- Support for Apache, Windows, Firewall, and authentication logs
- Log parsing and structuring

### 🤖 Threat Detection
- **ML-based detection**: Random Forest classifier for anomaly detection
- **Rule-based detection**: 
  - Brute force attack detection (multiple failed logins)
  - Traffic spike detection
- Threat classification: LOW / MEDIUM / HIGH
- Confidence scoring

### 🧠 AI Explanation Engine
- Automated threat explanations
- Impact analysis
- Actionable recommendations
- Ready for Gemini API integration

### 📊 Dashboard
- Real-time security overview
- Stats cards: Total logs, threats, critical alerts, security score
- Charts: Threat timeline, attack type distribution
- Recent threats display

### 📄 Reporting
- PDF security report generation
- Comprehensive threat summaries
- Exportable reports

### 📁 Threat History
- Complete threat history log
- Detailed threat information
- Filter and view historical threats

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **MongoDB** - NoSQL database for data storage
- **Scikit-learn** - Machine learning library
- **Pandas, NumPy** - Data processing
- **Passlib** - Password hashing
- **python-jose** - JWT token handling
- **ReportLab** - PDF generation

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **Chart.js + react-chartjs-2** - Data visualization
- **React Router** - Client-side routing
- **Axios** - HTTP client

## 📦 Project Structure

```
cybershield-ai/
├── backend/
│   ├── main.py                 # FastAPI entry point
│   ├── requirements.txt        # Python dependencies
│   ├── .env                    # Environment variables
│   ├── .env.example            # Environment template
│   └── app/
│       ├── __init__.py
│       ├── models/             # Pydantic models
│       ├── routes/             # API endpoints
│       │   ├── auth.py
│       │   ├── logs.py
│       │   ├── analyze.py
│       │   ├── threats.py
│       │   └── reports.py
│       ├── services/           # Business logic
│       │   ├── database.py
│       │   ├── auth.py
│       │   └── rules_engine.py
│       ├── ml/                 # ML threat detection
│       ├── log_parser/         # Log parsing module
│       └── ai/                 # AI explanation engine
├── frontend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── public/
│   └── src/
│       ├── index.tsx
│       ├── index.css
│       ├── App.tsx
│       ├── components/
│       │   └── Sidebar.tsx
│       ├── pages/
│       │   ├── Login.tsx
│       │   ├── Register.tsx
│       │   ├── Dashboard.tsx
│       │   ├── LogAnalyzer.tsx
│       │   ├── ThreatHistory.tsx
│       │   └── Reports.tsx
│       ├── context/
│       │   └── AuthContext.tsx
│       ├── services/
│       │   └── api.ts
│       └── types/
│           └── index.ts
├── models/                     # Saved ML models
├── database/                   # Database files
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- MongoDB running locally (or use MongoDB Atlas)

### 1. Backend Setup

```bash
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
.\venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment variables (optional - default config works)
# Copy .env.example to .env and modify as needed

# Start the server
python main.py
```

Backend will be running on: `http://localhost:8000`

API docs available at: `http://localhost:8000/docs`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend will be running on: `http://localhost:3000`

### 3. MongoDB Setup

#### Option A: Local MongoDB
1. Download and install MongoDB from https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. The default connection string is already configured: `mongodb://localhost:27017/cybershield`

#### Option B: MongoDB Atlas (Cloud)
1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get your connection string
4. Update `MONGO_URI` in `backend/.env`

## 🎯 Usage Guide

### Step 1: Create an Account
1. Open `http://localhost:3000`
2. Click "Sign up" to create an account
3. Or log in with existing credentials

### Step 2: Generate Sample Data
1. Go to Dashboard
2. Click "Generate Sample Data" to create test logs
3. Click "Run Analysis" to detect threats

### Step 3: Upload Your Own Logs
1. Go to Log Analyzer
2. Upload a log file, paste raw logs, or generate samples
3. Click "Process Logs"

### Step 4: View Threats
1. Go to Threat History to see all detected threats
2. View detailed threat information, explanations, and recommendations

### Step 5: Generate Reports
1. Go to Reports
2. Click "Download PDF Report" to export a security report

## 🔧 Configuration

### Environment Variables (`backend/.env`)

```env
GEMINI_API_KEY=your_gemini_api_key_here
MONGO_URI=mongodb://localhost:27017/cybershield
JWT_SECRET=your_secure_jwt_secret_key_here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Gemini API Integration (Optional)
To use real AI explanations with Gemini:
1. Get an API key from https://aistudio.google.com/
2. Set `GEMINI_API_KEY` in `backend/.env`
3. Modify `backend/app/ai/__init__.py` to call the Gemini API

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Logs
- `POST /api/logs/upload` - Upload log file or raw logs
- `POST /api/logs/sample` - Generate sample logs
- `GET /api/logs` - Get recent logs

### Analysis
- `POST /api/analyze` - Analyze custom logs
- `GET /api/analyze/quick` - Quick analyze existing logs

### Threats
- `GET /api/threats` - Get detected threats
- `GET /api/threats/stats` - Get threat statistics

### Reports
- `GET /api/reports` - Get reports
- `GET /api/reports/download` - Download PDF report

## 🧠 Machine Learning Model

The threat detection model uses a **Random Forest Classifier** trained on:
- Number of failed login attempts
- Number of successful logins
- Request frequency
- Time of day

The model automatically retrains on startup and saves itself to `models/threat_model.pkl`.

## 🎨 Screenshots & Features

### Dashboard
- Real-time security stats
- Interactive charts
- Recent threats list

### Log Analyzer
- File upload
- Raw log pasting
- Sample log generation
- Log table display

### Threat History
- Detailed threat cards
- Severity indicators
- AI explanations
- Recommendations

### Reports
- PDF export
- Summary statistics
- Threat details

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- Input validation with Pydantic
- CORS configuration

## 🛡️ Detection Rules

### Brute Force Attack
- Multiple failed login attempts from same IP
- Triggers at ≥ 5 failures

### Traffic Spike
- Unusually high number of requests
- Triggers at ≥ 30 requests

## 🚀 Production Deployment

### Backend Deployment
- Use Gunicorn + Nginx
- Set up proper environment variables
- Use MongoDB Atlas for database
- Enable HTTPS

### Frontend Deployment
- Run `npm run build`
- Deploy to Vercel, Netlify, or static hosting
- Configure API_URL for production


**CyberShield AI** - Making cybersecurity accessible with AI 🛡️
