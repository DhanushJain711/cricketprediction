from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

from .predictor import predict_score
from .schemas import PredictRequest, PredictResponse
from .utils import calculate_overs_left, calculate_run_rate, calculate_striker_rate

app = FastAPI(title="CricPredictor API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Mount static files
static_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "static")
if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

@app.get("/")
def root():
    # Serve the main HTML page
    static_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "static")
    index_path = os.path.join(static_dir, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"message": "CricPredictor Predictor API"}

@app.head("/")
def head_root():
    return {}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/predict-score", response_model=PredictResponse)
def score_prediction(request: PredictRequest) -> dict[str, float]:
    inputs = {
        "ball": request.ball,
        "run_total": request.runs,
        "wickets": request.wickets,
        "striker_score": request.striker_score,
        "non_striker_score": request.non_striker_runs,
        "overs_left": calculate_overs_left(request.ball),
        "run_rate": calculate_run_rate(request.runs, request.ball),
        "striker_rate": calculate_striker_rate(request.striker_score, request.striker_balls),
        "non_striker_rate": calculate_striker_rate(request.non_striker_runs, request.non_striker_balls),
    }
    predicted_score = predict_score(inputs)

    return {
        "predicted_score": predicted_score,
        "confidence": 0.0,  # Placeholder for confidence, as the model does not provide it
    }
