from pydantic import BaseModel


class PredictRequest(BaseModel):
    ball: float
    runs: float
    wickets: float
    striker_score: float
    striker_balls: float
    non_striker_runs: float
    non_striker_balls: float

class PredictResponse(BaseModel):
    predicted_score: float
    confidence: float
