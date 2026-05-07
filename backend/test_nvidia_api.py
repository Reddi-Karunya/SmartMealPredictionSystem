import os
import requests
from dotenv import load_dotenv

load_dotenv()

nvidia_api_key = os.environ.get('NVIDIA_API_KEY')
print(f"API Key: {nvidia_api_key[:20]}...")

prompt = """You are an AI system that predicts real-world attendance for hostel meals.

Your task is to estimate how many students will actually show up for a meal.

Consider:
- Not all students who select meals will attend
- Some skip meals due to exams, outings, or personal reasons
- Breakfast has lower attendance
- Dinner has higher attendance
- Weekends behave differently

Input:
Total Selected: 100
Meal Type: lunch
Day: weekday
Historical Trend: 10% typical drop for lunch

Output format (JSON only, no extra text):
{
  "predicted": number,
  "confidence": "low" | "medium" | "high",
  "reason": "string (1-2 lines)"
}"""

try:
    response = requests.post(
        'https://integrate.api.nvidia.com/v1/chat/completions',
        headers={
            'Authorization': f'Bearer {nvidia_api_key}',
            'Content-Type': 'application/json'
        },
        json={
            'model': 'meta/llama-3.1-405b-instruct',
            'messages': [{'role': 'user', 'content': prompt}],
            'temperature': 0.3,
            'max_tokens': 500
        },
        timeout=30
    )
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.ok:
        result = response.json()
        ai_response = result['choices'][0]['message']['content'].strip()
        print(f"AI Response: {ai_response}")
        
        import json
        parsed = json.loads(ai_response)
        print(f"Parsed: {parsed}")
        
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
