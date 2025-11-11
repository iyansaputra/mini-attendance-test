import { use, useState } from 'react';
import './App.css';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard'; 
import { Register } from './components/Register';

type View = 'login' | 'register' | 'dashboard';

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<View>('login');

  const handleLoginSuccess = (newToken: string) => {
    setToken(newToken);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setToken(null);
    setCurrentView('login');
  };

const renderView = () => {
    if (token) {
      // Jika sudah punya token
      return <Dashboard token={token} onLogout={handleLogout} />;
    }

    // Jika tidak punya token
    switch (currentView) {
      case 'login':
        return <Login 
                  onLoginSuccess={handleLoginSuccess} 
                  showRegister={() => setCurrentView('register')} 
               />;
      case 'register':
        return <Register 
                  showLogin={() => setCurrentView('login')}
               />;
      default:
        return <Login 
                  onLoginSuccess={handleLoginSuccess} 
                  showRegister={() => setCurrentView('register')} 
               />;
    }
  };

  return (
    <div className="App">
      <h1>Mini Attendance System</h1>
      <hr />
      {renderView()}
    </div>
  );
}

export default App;