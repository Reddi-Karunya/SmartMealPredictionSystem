🍽️ Smart Meal Prediction System

A full-stack web application to manage meal attendance, reduce food waste, and calculate fines for students who skip meals without prior notice. Built using **React**, **Flask**, and **SQLite**.

📌 Problem Statement

Hostels and canteens often face food wastage and cost inefficiencies due to unpredictable student attendance at meals. This system allows students to mark attendance for each meal of the day (breakfast, lunch, snacks, dinner), helping admins prepare the right amount of food.

🚀 Features

🧑‍🎓 Student View
- Submit attendance for individual meals.
- Session-based meal selection (prevents multiple submissions).
- Automatically disables submissions past deadlines.

🛠️ Admin Panel
- View all responses submitted on a selected date.
- View meal-wise counts to prepare food efficiently.
- Mark actual attendance for students.
- Calculate and view fines for no-shows.
- Delete invalid or test entries.

🛠 Tech Stack

 Part         Tech                     
---------------------------------------
 Frontend   -  React.js, HTML, CSS      
 Backend    -  Flask (Python)           
 Database   -  SQLite                   
 APIs       -  RESTful API              
 Tools      -  Git, GitHub, VS Code     

🌐 Live Demo

Check out the live application: [https://smart-meal-prediction-system-26zd.vercel.app/](https://smart-meal-prediction-system-26zd.vercel.app/)

📂 Project Structure

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

⚙️ Setup Instructions

🔧 Backend (Flask)

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

 🌐 Frontend (React)

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


 📊 API Endpoints

 🔁 Student APIs
- `POST /api/submit` – Submit a meal response.
- `GET /api/responses/<date>` – Fetch all responses for a specific date.

 🧾 Admin APIs
- `POST /api/mark_attendance` – Mark a student as attended.
- `DELETE /api/delete/<id>` – Delete a student response.
- `GET /api/fines/<date>` – Get no-show count and fines.
- `GET /api/meal_counts/<date>` – Get meal-wise preparation counts.

 📸 Screenshots


![Screenshot 2025-05-30 112705](https://github.com/user-attachments/assets/5156f9e6-3dae-4e71-bc63-e7fba9602825)
![Screenshot 2025-05-30 112729](https://github.com/user-attachments/assets/33b58d7a-210a-4138-a8ff-a8e67a995677)
![Screenshot 2025-05-30 112745](https://github.com/user-attachments/assets/ba746232-7171-4b4d-8a5d-fc269317f735)
![Screenshot 2025-05-30 112758](https://github.com/user-attachments/assets/974c3c8a-2c39-4f24-b2c6-482b7ebd6601)
![Screenshot 2025-05-30 112809](https://github.com/user-attachments/assets/94c6f6c2-49c9-487e-8bb4-d6bd09bc50d7)

💡 Future Scope

- Add mobile-responsive design
- Export reports in PDF/Excel format
- Admin authentication with JWT
- Email alerts/reminders before meal deadline

🙌 Acknowledgements

Built as a self-directed project to solve real-world hostel problems using full-stack development.

📧 Contact

**Developer:** [Reddi Karunya]  
**Email:** Karunya7806@gmail.com 
**Contact:** 8125484066
**GitHub:** [github.com/Reddi-Karunya](https://github.com/Reddi-Karunya)

⭐ *If you like this project, don't forget to give it a star on GitHub!*
