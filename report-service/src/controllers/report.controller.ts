import { PrismaClient, AttendanceStatus } from '@prisma/client';
import amqp from 'amqplib';

const prisma = new PrismaClient();

const JAM_MASUK = 9; // Jam 9 pagi (WIB)
const JAM_PULANG = 17; // Jam 5 sore (WIB)

export const processMessage = async (message: amqp.ConsumeMessage) => {
  try {
    const content = JSON.parse(message.content.toString());
    console.log(`[Controller] Received message:`, content);

    const { type, attendanceId, userId, checkInTime, checkOutTime } = content;

    if (type === 'CHECK_IN') {
      const checkIn = new Date(checkInTime);
      const checkInHour = checkIn.getHours();

      let status: AttendanceStatus = AttendanceStatus.HADIR;
      let notes = 'Hadir tepat waktu';

      if (checkInHour >= JAM_MASUK) {
        status = AttendanceStatus.TERLAMBAT;
        notes = `Terlambat, check-in jam ${checkInHour}`;
      }

      await prisma.attendanceReport.create({
        data: {
          date: new Date(checkIn.setHours(0, 0, 0, 0)),
          status: status,
          notes: notes,
          userId: userId,
          attendanceId: attendanceId,
        },
      });

      console.log(`[Controller] Processed CHECK_IN for attendanceId: ${attendanceId}`);

    } else if (type === 'CHECK_OUT') {
      const checkOut = new Date(checkOutTime);
      const checkOutHour = checkOut.getHours();

      let statusUpdate: Partial<{ status: AttendanceStatus, notes: string }> = {};

      if (checkOutHour < JAM_PULANG) {
        const existingReport = await prisma.attendanceReport.findUnique({
          where: { attendanceId: attendanceId }
        });

        if (existingReport?.status === AttendanceStatus.TERLAMBAT) {
          statusUpdate.notes = `${existingReport.notes} & Pulang Cepat jam ${checkOutHour}`;
        } else {
          statusUpdate.status = AttendanceStatus.PULANG_CEPAT;
          statusUpdate.notes = `Pulang Cepat, check-out jam ${checkOutHour}`;
        }
      }

      await prisma.attendanceReport.update({
        where: { attendanceId: attendanceId },
        data: { ...statusUpdate },
      });

      console.log(`[Controller] Processed CHECK_OUT for attendanceId: ${attendanceId}`);
    }

    return true; // Berhasil

  } catch (error) {
    console.error('[Controller] Error processing message:', error);
    return false; // Gagal
  }
};