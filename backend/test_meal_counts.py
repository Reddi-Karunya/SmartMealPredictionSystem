import requests
import json
from datetime import datetime

today = datetime.now().strftime('%Y-%m-%d')
url = f"http://localhost:5000/api/meal_counts/{today}"

try:
    response = requests.get(url, timeout=30)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"Error: {e}")
