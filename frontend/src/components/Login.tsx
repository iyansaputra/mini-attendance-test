import { useState } from 'react';
import axios from 'axios';

// Tipe data untuk properti yang diterima
interface LoginProps {
  onLoginSuccess: (token: string) => void;
  showRegister: () => void; 
}

const API_URL = 'http://localhost:3001/api/auth/login';

export function Login({ onLoginSuccess, showRegister }: LoginProps) { 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await axios.post(API_URL, {
        email: email,
        password: password,
      });
      onLoginSuccess(response.data.token);
    } catch (err: any) {
      console.error('Login Gagal:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Terjadi kesalahan saat login.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Silakan Login</h2>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button type="submit">Login</button>

      <button 
        type="button" 
        onClick={showRegister}
        style={{ backgroundColor: '#7f8c8d', marginTop: '10px' }}
      >
        Belum punya akun? Daftar
      </button>
    </form>
  );
}