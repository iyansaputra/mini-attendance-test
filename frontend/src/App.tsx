import { useState } from 'react';
import './App.css';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard'; 

function App() {
  const [token, setToken] = useState<string | null>(null);

  const handleLoginSuccess = (newToken: string) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    setToken(null);
  };

  return (
    <div className="App">
      <h1>Mini Attendance System</h1>
      <hr />
      {!token && (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
      {token && (
        <Dashboard token={token} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;