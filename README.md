# Student Performance ML App

A production-grade, full-stack web application that predicts student performance using Machine Learning.

## Architecture

- **Frontend**: Next.js (App Router), TypeScript, TailwindCSS, Shadcn/UI
- **Backend**: Node.js (Express), TypeScript, Prisma, PostgreSQL
- **ML Service**: Python (FastAPI), Scikit-Learn, Pandas
- **Infrastructure**: Docker Compose, Redis

## Prerequisites

- Docker & Docker Compose
- Node.js 18+
- Python 3.9+

## Getting Started

1.  **Clone the repository**
    ```bash
    git clone <repo-url>
    cd student-performance-ml-app
    ```

2.  **Environment Setup**
    Copy `.env.example` to `.env` in the root directory.
    ```bash
    cp .env.example .env
    ```

3.  **Start Services**
    Run the entire stack using Docker Compose:
    ```bash
    docker-compose up --build
    ```

    This will start:
    - Frontend: http://localhost:3000
    - Backend: http://localhost:3001
    - ML Service: http://localhost:8000
    - Postgres: localhost:5432
    - Redis: localhost:6379

4.  **Database Migration & Seed**
    (Run this in a separate terminal while containers are running)
    ```bash
    cd backend
    npm install
    npx prisma migrate dev
    npm run prisma:seed
    ```

## Development

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run dev
```

### ML Service
```bash
cd ml-service
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Features

- **User Authentication**: Signup, Login, Role-based access.
- **Prediction**: Single and Batch (CSV) predictions.
- **Dashboard**: Visualizations of student performance data.
- **Admin Panel**: Manage users and model training.

## Testing

- Frontend: `npm test` (in frontend dir)
- Backend: `npm test` (in backend dir)
- ML Service: `pytest` (in ml-service dir)
