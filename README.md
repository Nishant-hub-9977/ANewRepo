# AlgoTrader - Algorithmic Trading Platform

This is a full-stack algorithmic trading platform built with React and Flask. It enables users to create, backtest, and deploy trading strategies.

## Features

- User authentication and portfolio management
- Strategy creation with customizable parameters and indicators
- Backtesting engine to evaluate trading strategies with historical data
- Real-time market data visualization with interactive charts
- Trade execution interface with order management
- Performance analytics with profit/loss tracking
- Watchlist management for monitoring selected assets

## Tech Stack

### Frontend
- React with TypeScript
- TailwindCSS for styling
- Chart.js and Lightweight-Charts for data visualization
- React Router for navigation
- Axios for API requests

### Backend
- Flask (Python)
- SQLAlchemy for database ORM
- Flask-JWT-Extended for authentication
- YFinance for market data
- Pandas for data manipulation

## Getting Started

### Prerequisites
- Node.js and npm
- Python 3.8+
- pip

### Installation

1. Clone the repository
2. Install frontend dependencies:
   ```
   npm install
   ```
3. Install backend dependencies:
   ```
   cd backend
   pip install -r requirements.txt
   ```

### Running the Application

To run the frontend and backend concurrently:
```
npm run dev
```

Or separately:
```
# Frontend
npm run start-frontend

# Backend
npm run start-backend
```

## Project Structure

```
/
├── backend/              # Flask backend
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── app.py            # Main application file
│   └── requirements.txt  # Python dependencies
├── src/                  # React frontend
│   ├── components/       # Reusable components
│   ├── context/          # Context providers
│   ├── pages/            # Application pages
│   └── main.tsx          # Entry point
└── package.json          # Node.js dependencies
```

## License

MIT