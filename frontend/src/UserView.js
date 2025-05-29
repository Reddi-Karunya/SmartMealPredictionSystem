import React, { useState, useEffect } from 'react';

const MEAL_OPTIONS = [
  { type: 'breakfast', label: 'Breakfast', deadline: '08:00' },
  { type: 'lunch', label: 'Lunch', deadline: '12:00' },
  { type: 'snacks', label: 'Snacks', deadline: '16:00' },
  { type: 'dinner', label: 'Dinner', deadline: '18:00' }
];

function UserView() {
  const [formData, setFormData] = useState({
    name: '',
    hostel: '',
    meal_type: ''
  });
  const [submittedMeals, setSubmittedMeals] = useState([]);
  const [serverTime, setServerTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setServerTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getCurrentTime = () => serverTime.toTimeString().slice(0, 5);
  const today = serverTime.toISOString().split('T')[0];

  const isMealAvailable = (deadline) => getCurrentTime() < deadline;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.meal_type) {
      alert('Please select a meal');
      return;
    }

    if (!formData.name.trim() || !formData.hostel.trim()) {
      alert('Please enter your name and hostel');
      return;
    }

    if (submittedMeals.includes(formData.meal_type)) {
      alert('You have already submitted this meal');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          date: today
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit meal');
      }

      const updatedMeals = [...submittedMeals, formData.meal_type];
      setSubmittedMeals(updatedMeals);
      localStorage.setItem(`submittedMeals_${formData.name}_${today}`, JSON.stringify(updatedMeals));
      
      alert('Meal submitted successfully!');
      setFormData(prev => ({ ...prev, meal_type: '' }));
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    const storedMeals = localStorage.getItem(`submittedMeals_${formData.name}_${today}`);
    if (storedMeals) {
      setSubmittedMeals(JSON.parse(storedMeals));
    }
  }, [formData.name, today]);

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Meal Attendance System</h2>
      
      <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginTop: 0 }}>Submit Your Meal</h3>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Full Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Hostel:</label>
            <input
              type="text"
              name="hostel"
              value={formData.hostel}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Select Meal:</label>
            <select
              name="meal_type"
              value={formData.meal_type}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
            >
              <option value="">-- Select a Meal --</option>
              {MEAL_OPTIONS.map(meal => {
                const isClosed = !isMealAvailable(meal.deadline);
                const isSubmitted = submittedMeals.includes(meal.type);
                return (
                  <option
                    key={meal.type}
                    value={meal.type}
                    disabled={isClosed || isSubmitted}
                  >
                    {meal.label} {isClosed ? '(Closed)' : isSubmitted ? '(Submitted)' : ''}
                  </option>
                );
              })}
            </select>
          </div>
          
          <button
            type="submit"
            disabled={!formData.meal_type}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: formData.meal_type ? '#4CAF50' : '#cccccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: formData.meal_type ? 'pointer' : 'not-allowed'
            }}
          >
            Submit Attendance
          </button>
        </form>
      </div>
      
      <div style={{ marginTop: '20px', textAlign: 'center', color: '#666' }}>
        <p>Current Server Time: {serverTime.toLocaleTimeString()}</p>
      </div>
    </div>
  );
}

export default UserView;