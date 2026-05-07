import React, { useState, useEffect } from 'react';

function AdminPanel() {
  const [meals, setMeals] = useState([]);
  const [fines, setFines] = useState({ no_show_count: 0, total_fines: 0 });
  const [mealCounts, setMealCounts] = useState({ breakfast: 0, lunch: 0, snacks: 0, dinner: 0 });
  const [predictions, setPredictions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const today = new Date().toISOString().split('T')[0];
  const dayOfWeek = new Date().getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const dayType = isWeekend ? 'weekend' : 'weekday';

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const getFallbackPrediction = (count, mealType) => {
    const reductionMap = {
      'breakfast': 0.20,
      'lunch': 0.10,
      'snacks': 0.25,
      'dinner': 0.05
    };
    const reduction = reductionMap[mealType] || 0.10;
    return {
      predicted: Math.floor(count * (1 - reduction)),
      confidence: 'medium',
      reason: 'Using fallback logic: typical reduction based on meal type'
    };
  };

  const fetchPrediction = async (mealType, count) => {
    try {
      const response = await fetch(`${API_BASE}/api/predict-meal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalSelected: count,
          mealType,
          day: dayType
        })
      });
      
      if (response.ok) {
        return await response.json();
      } else {
        return getFallbackPrediction(count, mealType);
      }
    } catch (e) {
      console.error(`Prediction error for ${mealType}:`, e);
      return getFallbackPrediction(count, mealType);
    }
  };

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const countsResponse = await fetch(`${API_BASE}/api/meal_counts/${today}`);
      if (!countsResponse.ok) throw new Error('Failed to load meal counts');
      const counts = await countsResponse.json();
      setMealCounts(counts);

      const mealsResponse = await fetch(`${API_BASE}/api/responses/${today}`);
      if (mealsResponse.ok) {
        setMeals(await mealsResponse.json());
      }

      const finesResponse = await fetch(`${API_BASE}/api/fines/${today}`);
      if (finesResponse.ok) {
        setFines(await finesResponse.json());
      }

      const initialPredictions = {};
      for (const [mealType, count] of Object.entries(counts)) {
        initialPredictions[mealType] = getFallbackPrediction(count, mealType);
      }
      setPredictions(initialPredictions);
      setLoading(false);

      const newPredictions = {};
      for (const [mealType, count] of Object.entries(counts)) {
        newPredictions[mealType] = await fetchPrediction(mealType, count);
      }
      setPredictions(newPredictions);

    } catch (err) {
      console.error('Load data error:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
    const interval = setInterval(loadAllData, 30000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today]);

  const handleAction = async (action, id) => {
    try {
      let response;
      if (action === 'mark') {
        response = await fetch(`${API_BASE}/api/mark_attendance`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
      } else {
        if (!window.confirm('Are you sure you want to delete this record?')) return;
        response = await fetch(`${API_BASE}/api/delete/${id}`, {
          method: 'DELETE'
        });
      }

      if (response.ok) {
        await loadAllData();
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const filteredMeals = meals.filter(meal =>
    meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    meal.hostel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getConfidenceColor = (confidence) => {
    switch (confidence?.toLowerCase()) {
      case 'high': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'low': return '#f44336';
      default: return '#999';
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <h2>Meal Attendance System - Admin Panel</h2>
        <h3>Date: {today}</h3>
        <div style={{ padding: '40px', textAlign: 'center', fontSize: '1.2rem' }}>
          Loading data... Please wait.
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-container">
        <h2>Meal Attendance System - Admin Panel</h2>
        <h3>Date: {today}</h3>
        <div style={{ padding: '20px', color: 'red', border: '1px solid red', borderRadius: '8px', margin: '20px 0' }}>
          Error: {error}
          <br />
          <button onClick={loadAllData} style={{ marginTop: '10px', padding: '8px 16px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <h2>Meal Attendance System - Admin Panel</h2>
      <h3>Date: {today}</h3>

      <div className="summary-grid">
        <div className="meal-counts">
          <h3>Meal Preparation Counts 🍽️</h3>
          <div className="count-grid">
            {Object.entries(mealCounts).map(([meal, count]) => (
              <div key={meal} className="count-card">
                <h4>{meal.charAt(0).toUpperCase() + meal.slice(1)}</h4>
                <p>{count}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="fines-summary">
          <h3>Fines Summary 💰</h3>
          <div className="fines-card">
            <p><strong>No Shows:</strong> {fines.no_show_count}</p>
            <p><strong>Total Fines:</strong> ₹{fines.total_fines}</p>
          </div>
        </div>
      </div>

      <div className="ai-prediction-section">
        <h3>AI Meal Prediction Dashboard 🤖</h3>
        <div className="prediction-grid">
          {Object.entries(mealCounts).map(([mealType, selectedCount]) => {
            const prediction = predictions[mealType];
            return (
              <div key={mealType} className="prediction-card">
                <h4>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</h4>
                <div className="prediction-details">
                  <p><strong>Selected Count:</strong> {selectedCount}</p>
                  <p><strong>Predicted Attendance:</strong> <span className="predicted-count">{prediction?.predicted || '-'}</span></p>
                  <p><strong>Confidence:</strong> <span style={{ color: getConfidenceColor(prediction?.confidence) }}>{prediction?.confidence || '-'}</span></p>
                  <p><strong>Reason:</strong> {prediction?.reason || '-'}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ margin: '20px 0' }}>
        <input
          type="text"
          placeholder="Search by name or hostel..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{
            padding: '10px',
            width: '100%',
            maxWidth: '400px',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        />
      </div>

      <h3>Meal Responses ({filteredMeals.length})</h3>
      {filteredMeals.length === 0 ? (
        <p>No meal responses match your search.</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Hostel</th>
                <th>Meal Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMeals.map(meal => (
                <tr key={meal.id}>
                  <td>{meal.name}</td>
                  <td>{meal.hostel}</td>
                  <td>{meal.meal_type}</td>
                  <td className={meal.attended ? 'attended' : 'not-attended'}>
                    {meal.attended ? 'Attended' : 'Not Attended'}
                  </td>
                  <td className="actions">
                    {!meal.attended && (
                      <button onClick={() => handleAction('mark', meal.id)} className="mark-btn">
                        Mark Attended
                      </button>
                    )}
                    <button onClick={() => handleAction('delete', meal.id)} className="delete-btn">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style jsx>{`
        .admin-container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
          font-family: Arial, sans-serif;
        }
        .summary-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 30px;
        }
        .meal-counts, .fines-summary {
          flex: 1 1 300px;
        }
        .count-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 10px;
        }
        .count-card {
          padding: 15px;
          background-color: #f0f8ff;
          border-radius: 8px;
          text-align: center;
        }
        .fines-card {
          padding: 15px;
          background-color: #f8f8f8;
          border-radius: 8px;
        }
        .ai-prediction-section {
          margin: 30px 0;
        }
        .prediction-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }
        .prediction-card {
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          color: white;
        }
        .prediction-card h4 {
          margin: 0 0 15px 0;
          font-size: 1.2rem;
        }
        .prediction-details p {
          margin: 8px 0;
          font-size: 0.95rem;
        }
        .predicted-count {
          font-size: 1.3rem;
          font-weight: bold;
          color: #ffd700;
        }
        .table-container {
          overflow-x: auto;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        th {
          background-color: #f2f2f2;
        }
        .attended {
          color: green;
        }
        .not-attended {
          color: red;
        }
        .actions {
          display: flex;
          gap: 8px;
        }
        button {
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .mark-btn {
          background-color: #4CAF50;
          color: white;
        }
        .delete-btn {
          background-color: #f44336;
          color: white;
        }
      `}</style>
    </div>
  );
}

export default AdminPanel;
