import requests
import json

url = "http://localhost:5000/api/predict-meal"
data = {
    "totalSelected": 100,
    "mealType": "lunch",
    "day": "weekday"
}

try:
    response = requests.post(url, json=data, timeout=60)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"Error: {e}")
