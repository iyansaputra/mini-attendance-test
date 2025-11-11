import { useState } from 'react';
import axios from 'axios';

interface RegisterProps {
  showLogin: () => void; 
}

const API_URL = 'http://localhost:3001/api/auth/register';

export function Register({ showLogin }: RegisterProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); 

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (password.length < 6) {
      setError('Password minimal harus 6 karakter.');
      return;
    }

    try {
      await axios.post(API_URL, {
        email: email,
        password: password,
        name: name
      });

      setSuccess('Registrasi berhasil! Silakan kembali dan login.');

      setTimeout(() => {
        showLogin();
      }, 2000);

    } catch (err: any) {
      console.error('Register Gagal:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Registrasi gagal. Email mungkin sudah dipakai.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Buat Akun Baru</h2>
      <div>
        <label>Nama Lengkap:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
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
        <label>Password (min. 6 karakter):</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <button type="submit" disabled={!!success}>Daftar</button>

      <button 
        type="button" 
        onClick={showLogin} 
        style={{ backgroundColor: '#7f8c8d', marginTop: '10px' }}
      >
        Sudah punya akun? Login
      </button>
    </form>
  );
}