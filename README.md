# ASD Detection System

A machine learning-based system for Autism Spectrum Disorder (ASD) detection using speech analysis, running on Rockdo microcomputer.

## Architecture

The system consists of three main components:

1. **Frontend**: Web interface for audio recording and visualization
2. **Backend**: FastAPI server handling audio processing and model inference
3. **Edge Device**: Rockdo microcomputer running optimized ML model

## Setup

### Prerequisites

- Python 3.8+
- Node.js 14+
- Rockdo microcomputer
- Redis (optional, for caching)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd asd_detection
```

2. Set up Python virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the backend server:
```bash
cd backend
uvicorn app.main:app --reload
```

5. Start the frontend development server:
```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```
asd_detection/
├── backend/
│   ├── app/
│   │   ├── api/          # API endpoints
│   │   ├── core/         # Core functionality
│   │   ├── models/       # ML models
│   │   └── utils/        # Utility functions
│   └── tests/            # Backend tests
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── services/     # API services
│   │   └── utils/        # Frontend utilities
│   └── tests/            # Frontend tests
└── docs/                 # Documentation
```

## API Documentation

Once the backend server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Development

### Running Tests

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

### Code Style

- Backend: Follow PEP 8 guidelines
- Frontend: Use ESLint and Prettier

## Deployment

1. Deploy the backend:
```bash
cd backend
docker build -t asd-detection-backend .
docker run -p 8000:8000 asd-detection-backend
```

2. Deploy the frontend:
```bash
cd frontend
npm run build
# Deploy the build directory to your web server
```

3. Deploy to Rockdo:
```bash
# Follow the deployment instructions in docs/rockdo_deployment.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 