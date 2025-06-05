import React, { useState, useEffect, useCallback } from 'react';

function AdminPanel() {
  const [data, setData] = useState({
    meals: [],
    fines: { no_show_count: 0, total_fines: 0 },
    mealCounts: { breakfast: 0, lunch: 0, snacks: 0, dinner: 0 },
    loading: true,
    error: null
  });

  const [searchTerm, setSearchTerm] = useState('');
  const today = new Date().toISOString().split('T')[0];

  const fetchData = useCallback(async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }));

      const [mealsRes, finesRes, countsRes] = await Promise.all([
        fetch(`http://localhost:5000/api/responses/${today}`),
        fetch(`http://localhost:5000/api/fines/${today}`),
        fetch(`http://localhost:5000/api/meal_counts/${today}`)
      ]);

      if (!mealsRes.ok || !finesRes.ok || !countsRes.ok)
        throw new Error('One or more requests failed');

      const [meals, fines, counts] = await Promise.all([
        mealsRes.json(),
        finesRes.json(),
        countsRes.json()
      ]);

      setData({
        meals,
        fines,
        mealCounts: counts,
        loading: false,
        error: null
      });
    } catch (error) {
      setData(prev => ({ ...prev, loading: false, error: error.message }));
    }
  }, [today]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleAction = async (action, id) => {
    try {
      let response;
      if (action === 'mark') {
        response = await fetch('http://localhost:5000/api/mark_attendance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
      } else {
        if (!window.confirm('Are you sure you want to delete this record?')) return;
        response = await fetch(`http://localhost:5000/api/delete/${id}`, {
          method: 'DELETE'
        });
      }

      if (!response.ok) throw new Error(`Failed to ${action}`);
      await fetchData();
    } catch (error) {
      alert(error.message);
    }
  };

  const filteredMeals = data.meals.filter(meal =>
    meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    meal.hostel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (data.loading) return <div className="loading">Loading...</div>;
  if (data.error) return <div className="error">Error: {data.error}</div>;

  return (
    <div className="admin-container">
      <h2>Meal Attendance System - Admin Panel</h2>
      <h3>Date: {today}</h3>

      <div className="summary-grid">
        <div className="meal-counts">
          <h3>Meal Preparation Counts 🍽️</h3>
          <div className="count-grid">
            {Object.entries(data.mealCounts).map(([meal, count]) => (
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
            <p><strong>No Shows:</strong> {data.fines.no_show_count}</p>
            <p><strong>Total Fines:</strong> ₹{data.fines.total_fines}</p>
          </div>
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
        .loading, .error {
          padding: 20px;
          text-align: center;
        }
        .error {
          color: red;
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
