# 🍽️ Smart Meal Prediction System

A full-stack web application to manage meal attendance, reduce food waste, and calculate fines for students who skip meals without prior notice. Built using **React**, **Flask**, and **SQLite**.

---

## 📌 Problem Statement

Hostels and canteens often face food wastage and cost inefficiencies due to unpredictable student attendance at meals. This system allows students to mark attendance for each meal of the day (breakfast, lunch, snacks, dinner), helping admins prepare the right amount of food.

---

## 🚀 Features

### 🧑‍🎓 Student View
- Submit attendance for individual meals.
- Session-based meal selection (prevents multiple submissions).
- Automatically disables submissions past deadlines.

### 🛠️ Admin Panel
- View all responses submitted on a selected date.
- View meal-wise counts to prepare food efficiently.
- Mark actual attendance for students.
- Calculate and view fines for no-shows.
- Delete invalid or test entries.

---

## 🛠 Tech Stack

| Part        | Tech                     |
|-------------|--------------------------|
| Frontend    | React.js, HTML, CSS      |
| Backend     | Flask (Python)           |
| Database    | SQLite                   |
| APIs        | RESTful API              |
| Tools       | Git, GitHub, VS Code     |

---

## 📂 Project Structure

```
smart-meal-system/
├── backend/
│   └── app.py
│   └── meals.db
├── frontend/
│   └── src/
│       ├── App.js
│       ├── AdminPanel.js
│       └── UserView.js
├── README.md
└── requirements.txt
```

---

## ⚙️ Setup Instructions

### 🔧 Backend (Flask)

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pip install flask flask_sqlalchemy flask_cors
   ```

3. Run the backend:
   ```bash
   python app.py
   ```

### 🌐 Frontend (React)

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the frontend:
   ```bash
   npm start
   ```

The frontend will run at `http://localhost:3000`, and backend at `http://localhost:5000`.

---

## 📊 API Endpoints

### 🔁 Student APIs
- `POST /api/submit` – Submit a meal response.
- `GET /api/responses/<date>` – Fetch all responses for a specific date.

### 🧾 Admin APIs
- `POST /api/mark_attendance` – Mark a student as attended.
- `DELETE /api/delete/<id>` – Delete a student response.
- `GET /api/fines/<date>` – Get no-show count and fines.
- `GET /api/summary/<date>` – Get meal-wise preparation counts.

---

## 📸 Screenshots

> (Add screenshots here if you have them!)

---

## 🔮 Future Improvements

- Add user authentication (students and admins).
- Set automatic cron-based deadlines for each meal.
- Export reports as CSV or Excel.
- Mobile responsiveness and PWA support.

---

## 🙌 Acknowledgements

Built as a self-directed project to solve real-world hostel problems using full-stack development.

---

## 📧 Contact

**Developer:** [Your Name]  
**Email:** your.email@example.com  
**GitHub:** [github.com/your-username](https://github.com/your-username)

---

⭐ *If you like this project, don't forget to give it a star on GitHub!*