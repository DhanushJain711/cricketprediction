import joblib
import numpy as np
from keras.models import load_model

model = load_model('src/models/model_files/cricket_score_predictor_v2.keras')
scaler = joblib.load('src/models/model_files/scaler_v2.pkl')
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
    return float(prediction[0])


if __name__ == "__main__":
    while True:
        user_inputs = user_input()
        predicted_score = predict_score(user_inputs)
        print(f"\nPredicted final score: {predicted_score:.2f}")

        another = input("\nWould you like to make another prediction? (y/n): ")
        if another.lower() != 'y':
            break

