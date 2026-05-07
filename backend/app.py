from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import os
import requests
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Database configuration
basedir = os.path.abspath(os.path.dirname(__file__))
db_url = os.environ.get('DATABASE_URL')
if db_url and db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

app.config['SQLALCHEMY_DATABASE_URI'] = db_url or ('sqlite:///' + os.path.join(basedir, 'meals.db'))
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Meal(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    hostel = db.Column(db.String(100), nullable=False)
    date = db.Column(db.String(20), nullable=False)
    meal_type = db.Column(db.String(20), nullable=False)
    will_eat = db.Column(db.Boolean, default=True)
    attended = db.Column(db.Boolean, default=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

# Create database and tables
def create_database():
    with app.app_context():
        db.create_all()
        print("Database created successfully!")

create_database()

@app.route('/api/submit', methods=['POST'])
def submit_meal():
    try:
        data = request.json
        required_fields = ['name', 'hostel', 'meal_type']
        
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        new_meal = Meal(
            name=data['name'],
            hostel=data['hostel'],
            date=datetime.now().strftime('%Y-%m-%d'),
            meal_type=data['meal_type'],
            will_eat=True
        )
        db.session.add(new_meal)
        db.session.commit()
        return jsonify({'message': 'Meal submitted successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/responses/<date>', methods=['GET'])
def get_responses(date):
    try:
        meals = Meal.query.filter_by(date=date).order_by(Meal.timestamp).all()
        return jsonify([{
            'id': meal.id,
            'name': meal.name,
            'hostel': meal.hostel,
            'date': meal.date,
            'meal_type': meal.meal_type,
            'will_eat': meal.will_eat,
            'attended': meal.attended,
            'timestamp': meal.timestamp.isoformat() if meal.timestamp else None
        } for meal in meals])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/fines/<date>', methods=['GET'])
def get_fines(date):
    try:
        no_shows = Meal.query.filter_by(date=date, will_eat=True, attended=False).count()
        return jsonify({
            'no_show_count': no_shows,
            'total_fines': no_shows * 50
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/meal_counts/<date>', methods=['GET'])
def get_meal_counts(date):
    try:
        meals = Meal.query.filter_by(date=date, will_eat=True).all()
        counts = {
            'breakfast': 0,
            'lunch': 0,
            'snacks': 0,
            'dinner': 0
        }
        for meal in meals:
            if meal.meal_type in counts:
                counts[meal.meal_type] += 1
        return jsonify(counts)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/mark_attendance', methods=['POST'])
def mark_attendance():
    try:
        data = request.json
        if not data.get('id'):
            return jsonify({'error': 'Missing meal ID'}), 400
        
        meal = Meal.query.get(data['id'])
        if not meal:
            return jsonify({'error': 'Meal not found'}), 404
        
        meal.attended = True
        db.session.commit()
        return jsonify({'message': 'Attendance marked successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/delete/<int:id>', methods=['DELETE'])
def delete_meal(id):
    try:
        meal = Meal.query.get(id)
        if not meal:
            return jsonify({'error': 'Meal not found'}), 404
        
        db.session.delete(meal)
        db.session.commit()
        return jsonify({'message': 'Meal deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/predict-meal', methods=['POST'])
def predict_meal():
    try:
        data = request.json
        total_selected = data.get('totalSelected', 0)
        meal_type = data.get('mealType', 'breakfast')
        day = data.get('day', 'weekday')
        
        reduction_map = {
            'breakfast': 0.20,
            'lunch': 0.10,
            'snacks': 0.25,
            'dinner': 0.05
        }
        reduction = reduction_map.get(meal_type, 0.10)
        historical_trend = f"{int(reduction * 100)}% typical drop for {meal_type}"
        
        prompt = f"""You are an AI system that predicts real-world attendance for hostel meals.

Your task is to estimate how many students will actually show up for a meal.

Consider:
- Not all students who select meals will attend
- Some skip meals due to exams, outings, or personal reasons
- Breakfast has lower attendance
- Dinner has higher attendance
- Weekends behave differently

Input:
Total Selected: {total_selected}
Meal Type: {meal_type}
Day: {day}
Historical Trend: {historical_trend}

Output format (JSON only, no extra text):
{{
  "predicted": number,
  "confidence": "low" | "medium" | "high",
  "reason": "string (1-2 lines)"
}}"""

        nvidia_api_key = os.environ.get('NVIDIA_API_KEY')
        fallback_prediction = int(total_selected * (1 - reduction))
        
        if not nvidia_api_key:
            return jsonify({
                'predicted': fallback_prediction,
                'confidence': 'medium',
                'reason': 'Using fallback logic: typical reduction based on meal type'
            })
        
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
                timeout=60
            )
            
            if response.ok:
                result = response.json()
                ai_response = result['choices'][0]['message']['content'].strip()
                
                ai_response = ai_response.replace('```json', '').replace('```', '').strip()
                
                import json
                parsed = json.loads(ai_response)
                
                return jsonify({
                    'predicted': int(parsed.get('predicted', fallback_prediction)),
                    'confidence': parsed.get('confidence', 'medium'),
                    'reason': parsed.get('reason', 'AI prediction')
                })
            else:
                raise Exception(f"NVIDIA API error: {response.status_code}")
                
        except Exception as e:
            print(f"AI prediction failed: {e}")
            return jsonify({
                'predicted': fallback_prediction,
                'confidence': 'medium',
                'reason': 'Fallback logic used due to AI service error'
            })
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)