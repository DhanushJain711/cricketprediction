import numpy as np
from tensorflow.keras.models import load_model
import joblib

model = load_model('cricket_score_predictor.h5')

scaler = joblib.load('scaler.pkl')

feature_names = ['ball', 'run_total', 'wickets', 'striker_score', 'non_striker_score', 'overs_left', 'run_rate', 'striker_rate', 'non_striker_rate']

def user_input():
    inputs = {}
    for feature in feature_names:
        value = float(input(f"Enter the value for {feature}: "))
        inputs[feature] = value
    return inputs

def predict_score(inputs):
    input_array = np.array([[inputs[feature] for feature in feature_names]])
    input_scaled = scaler.transform(input_array)
    prediction = model.predict(input_scaled)
    return float(prediction)


if __name__ == "__main__":
    while True:
        user_inputs = user_input()
        predicted_score = predict_score(user_inputs)
        print(f"\nPredicted final score: {predicted_score:.2f}")
        
        another = input("\nWould you like to make another prediction? (y/n): ")
        if another.lower() != 'y':
            break