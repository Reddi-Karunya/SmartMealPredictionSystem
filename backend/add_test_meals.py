import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import app, db, Meal
from datetime import datetime

today = datetime.now().strftime('%Y-%m-%d')

test_meals = [
    {'name': 'Alice', 'hostel': 'A', 'meal_type': 'breakfast'},
    {'name': 'Bob', 'hostel': 'A', 'meal_type': 'breakfast'},
    {'name': 'Charlie', 'hostel': 'B', 'meal_type': 'breakfast'},
    {'name': 'David', 'hostel': 'A', 'meal_type': 'lunch'},
    {'name': 'Eve', 'hostel': 'B', 'meal_type': 'lunch'},
    {'name': 'Frank', 'hostel': 'A', 'meal_type': 'lunch'},
    {'name': 'Grace', 'hostel': 'B', 'meal_type': 'lunch'},
    {'name': 'Henry', 'hostel': 'A', 'meal_type': 'snacks'},
    {'name': 'Ivy', 'hostel': 'B', 'meal_type': 'snacks'},
    {'name': 'Jack', 'hostel': 'A', 'meal_type': 'dinner'},
    {'name': 'Kate', 'hostel': 'B', 'meal_type': 'dinner'},
    {'name': 'Leo', 'hostel': 'A', 'meal_type': 'dinner'},
    {'name': 'Mia', 'hostel': 'B', 'meal_type': 'dinner'},
    {'name': 'Noah', 'hostel': 'A', 'meal_type': 'dinner'},
]

with app.app_context():
    for meal_data in test_meals:
        new_meal = Meal(
            name=meal_data['name'],
            hostel=meal_data['hostel'],
            date=today,
            meal_type=meal_data['meal_type'],
            will_eat=True
        )
        db.session.add(new_meal)
    db.session.commit()
    print(f"Added {len(test_meals)} test meals for {today}!")
