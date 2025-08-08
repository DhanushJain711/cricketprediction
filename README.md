# CricPredictor

An end-to-end machine learning system for predicting T20 cricket final scores using ball-by-ball match data. The system includes data processing, neural network training, REST API deployment, containerization, and a web interface.

## Project Overview

Predicts final T20 cricket innings scores with ~19.5 runs MAE using real-time match state data including current score, wickets, batsman stats, and match progress.

**Try it out!** [https://cricpredictor-pb23.onrender.com](https://cricpredictor-pb23.onrender.com)

## Machine Learning Models

### Neural Network Architecture
- **Model:** Feedforward neural network (64→32→16→1 neurons)
- **Features:** 9 engineered features (ball, run_total, wickets, striker/non-striker scores and rates, overs_left, run_rate)
- **Performance:** 19.5 MAE (Mean Absolute Error in runs)
- **Framework:** Keras/TensorFlow with StandardScaler normalization
- **Regularization:** Batch normalization, early stopping with validation monitoring

### Model Comparison
- **Neural Network:** 19.5 MAE
- **Gradient Boosting:** 20.21 MAE
- **Linear Regression:** 21.26 MAE

### Data Pipeline
- **Source:** Ball-by-ball T20I data from [cricsheet.org](https://cricsheet.org/matches/)
- **Processing:** Feature engineering for run rates, strike rates, overs remaining
- **Tools:** pandas, numpy for data manipulation; scikit-learn for preprocessing

## API & Backend

### FastAPI REST API
- **Framework:** FastAPI with automatic OpenAPI documentation
- **Endpoints:**
  - `POST /predict-score`: Real-time score prediction
  - `GET /health`: Health check endpoint
  - `GET /`: Serves static web interface
- **Features:** CORS middleware, request validation with Pydantic schemas
- **Model Loading:** Keras model and StandardScaler loaded at startup

### Containerization & Deployment
The API was contaizerized using Docker and deployed live on Render.

### File Structure
```
├── src/               # Backend services
├──────app/            # FastAPI application
├──────models/         # Jupyter notebooks for training
├──────utils/          # Data processing utilities
├── static/            # Frontend assets
├── Dockerfile         # Container configuration
└── pyproject.toml     # Python dependencies
```

