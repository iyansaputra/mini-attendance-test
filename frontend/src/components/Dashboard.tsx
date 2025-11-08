import { useState } from 'react';
import axios from 'axios';
import { Report } from './Report';

interface DashboardProps {
  token: string;
  onLogout: () => void;
}

export function Dashboard({ token, onLogout }: DashboardProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const API_CHECK_IN = 'http://localhost:3001/api/attendance/check-in';
  const API_CHECK_OUT = 'http://localhost:3001/api/attendance/check-out';

  // Fungsi untuk membuat "Authorization Header"
  const createAuthHeaders = () => {
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  };

  const handleCheckIn = async () => {
    setMessage(null);
    setError(null);
    try {
      const response = await axios.post(API_CHECK_IN, {}, createAuthHeaders());
      setMessage(response.data.message);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal check-in');
    }
  };

  const handleCheckOut = async () => {
    setMessage(null);
    setError(null);
    try {
      const response = await axios.post(API_CHECK_OUT, {}, createAuthHeaders());
      setMessage(response.data.message);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal check-out');
    }
  };

  // --- Tampilan (View) ---
  return (
    <div className="Dashboard">
      <h2>Dashboard Absensi</h2>
      <p>Anda sudah login.</p>

      <button onClick={handleCheckIn}>Check-In Sekarang</button>
      <button onClick={handleCheckOut}>Check-Out Sekarang</button>

      <hr />

      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <hr />

      <Report token={token} />
      <button onClick={onLogout} style={{ marginTop: '20px' }}>Logout</button>
    </div>
  );
}