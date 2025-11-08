import { Request, Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middleware/auth.middleware';
import { ATTENDANCE_QUEUE, sendMessageToQueue } from '../rabbitmq';
import { AttendanceStatus } from '@prisma/client';

// Logika untuk Check-in
export const checkIn = async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const userId = authReq.user!.userId;

  try {
    const lastAttendance = await prisma.attendance.findFirst({
      where: { userId: userId },
      orderBy: { checkInTime: 'desc' },
    });

    if (lastAttendance && !lastAttendance.checkOutTime) {
      return res.status(409).json({
        message: 'You have already checked in. Please check-out first.',
      });
    }

    const newAttendance = await prisma.attendance.create({
      data: {
        checkInTime: new Date(),
        userId: userId,
      },
    });

    const eventMessage = JSON.stringify({
      type: 'CHECK_IN',
      attendanceId: newAttendance.id,
      userId: newAttendance.userId,
      checkInTime: newAttendance.checkInTime.toISOString(),
    });

    sendMessageToQueue(ATTENDANCE_QUEUE, eventMessage);

    res.status(201).json({
      message: 'Check-in successful',
      data: newAttendance,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Logika untuk Check-out
export const checkOut = async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const userId = authReq.user!.userId; // Ambil ID user dari token

  try {
    const lastAttendance = await prisma.attendance.findFirst({
      where: {
        userId: userId,
      },
      orderBy: {
        checkInTime: 'desc',
      },
    });

    if (!lastAttendance || lastAttendance.checkOutTime) {
      return res.status(409).json({ // 409 Conflict
        message: 'You have not checked in yet, or you have already checked out.',
      });
    }

    const updatedAttendance = await prisma.attendance.update({
      where: {
        id: lastAttendance.id,
      },
      data: {
        checkOutTime: new Date(),
      },
    });

    const eventMessage = JSON.stringify({
      type: 'CHECK_OUT',
      attendanceId: updatedAttendance.id,
      userId: updatedAttendance.userId,
      checkInTime: updatedAttendance.checkInTime.toISOString(),
      checkOutTime: updatedAttendance.checkOutTime?.toISOString(), 
    });

    sendMessageToQueue(ATTENDANCE_QUEUE, eventMessage);

    res.status(200).json({
      message: 'Check-out successful',
      data: updatedAttendance,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Logika untuk Mengambil Laporan
export const getReport = async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const userId = authReq.user!.userId; // Ambil ID user dari token

  try {
    const { status, date } = req.query;

    const whereClause: any = {
      userId: userId, 
    };

    if (status && Object.values(AttendanceStatus).includes(status as any)) {
      whereClause.status = status as AttendanceStatus;
    }

    if (date && typeof date === 'string') {
      const filterDate = new Date(date);
      whereClause.date = {
        gte: new Date(filterDate.setHours(0, 0, 0, 0)),
        lt: new Date(filterDate.setDate(filterDate.getDate() + 1)),
      };
    }

    const reports = await prisma.attendanceReport.findMany({
      where: whereClause,
      orderBy: {
        date: 'desc',
      },
      include: {
      }
    });

    res.status(200).json({
      message: 'Reports fetched successfully',
      count: reports.length,
      data: reports,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};