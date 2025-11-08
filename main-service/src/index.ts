import express, { Request, Response } from 'express';
import cors from 'cors';
import { initRabbitMQ } from './rabbitmq';

import authRoutes from './routes/auth.routes';
import attendanceRoutes from './routes/attendance.routes'; 

// Tentukan Port untuk server 
const PORT = process.env.PORT || 3001;

// Inisialisasi aplikasi Express
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes); 

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Main Service is running and healthy!',
  });
});


const startServer = async () => {
  try {
    await initRabbitMQ();
    app.listen(PORT, () => {
      console.log(`[Main Service] Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();