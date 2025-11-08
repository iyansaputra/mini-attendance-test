import { useState, useEffect } from 'react';
import axios from 'axios';

const API_REPORT_URL = 'http://localhost:3001/api/attendance/report';

interface ReportProps {
  token: string;
}

interface ReportRow {
  id: number;
  date: string;
  status: 'HADIR' | 'TERLAMBAT' | 'PULANG_CEPAT' | 'TIDAK_HADIR';
  notes: string | null;
  userId: number;
  attendanceId: number;
}

export function Report({ token }: ReportProps) {
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const fetchReports = async () => {
    setLoading(true);
    setError(null);

    try {
      const authHeaders = {
        headers: { 'Authorization': `Bearer ${token}` }
      };

      const params = {
        date: filterDate || undefined,
        status: filterStatus || undefined,
      };

      const response = await axios.get(API_REPORT_URL, {
        ...authHeaders,
        params: params 
      });

      setReports(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mengambil laporan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [token]);
  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReports(); 
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h3>Laporan Absensi Saya</h3>

      {/* --- FORM FILTER --- */}
      <form onSubmit={handleFilterSubmit}>
        <input 
          type="date" 
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Semua Status</option>
          <option value="HADIR">Hadir</option>
          <option value="TERLAMBAT">Terlambat</option>
          <option value="PULANG_CEPAT">Pulang Cepat</option>
        </select>
        <button type="submit">Filter</button>
      </form>

      {/* --- TAMPILAN DATA --- */}
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table border={1} style={{ width: '100%', marginTop: '10px' }}>
        <thead>
          <tr>
            <th>Tanggal</th>
            <th>Status</th>
            <th>Catatan</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id}>
              <td>{new Date(report.date).toLocaleDateString('id-ID')}</td>
              <td>{report.status}</td>
              <td>{report.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Fitur Print (Poin 3) */}
      <button onClick={() => window.print()} style={{ marginTop: '10px' }}>
        Cetak Laporan
      </button>
    </div>
  );
}