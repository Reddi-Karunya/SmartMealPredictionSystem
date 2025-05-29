import React, { useState } from 'react';
import AdminLogin from './AdminLogin';
import AdminPanel from './AdminPanel';
import UserView from './UserView';

function App() {
  const [view, setView] = useState('user');
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogout = () => {
    setIsAdmin(false);
    setView('user');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
      <header style={{ 
        padding: '15px 20px', 
        backgroundColor: '#2c3e50', 
        color: 'white',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center'
        }}>
          <h1 style={{ margin: 0 }}>Meal Attendance System</h1>
          <div>
            <button 
              onClick={() => setView('user')} 
              style={{ 
                marginRight: '10px', 
                padding: '8px 15px',
                backgroundColor: view === 'user' ? '#3498db' : 'transparent',
                color: 'white',
                border: '1px solid white',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Student View
            </button>
            <button 
              onClick={() => setView('admin')} 
              style={{ 
                marginRight: '10px', 
                padding: '8px 15px',
                backgroundColor: view === 'admin' ? '#3498db' : 'transparent',
                color: 'white',
                border: '1px solid white',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Admin View
            </button>
            {isAdmin && (
              <button 
                onClick={handleLogout} 
                style={{ 
                  padding: '8px 15px',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </header>

      <main style={{ 
        maxWidth: '1200px', 
        margin: '20px auto', 
        padding: '0 20px'
      }}>
        {view === 'user' && <UserView />}
        {view === 'admin' && !isAdmin && <AdminLogin onLogin={setIsAdmin} />}
        {view === 'admin' && isAdmin && <AdminPanel />}
      </main>

      <footer style={{ 
        padding: '15px 20px', 
        backgroundColor: '#2c3e50', 
        color: 'white', 
        textAlign: 'center',
        marginTop: '20px'
      }}>
        <p>Meal Attendance System © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;