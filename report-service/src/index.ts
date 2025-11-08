import amqp, { Connection, Channel } from 'amqplib';
import { processMessage } from './controllers/report.controller';

const ATTENDANCE_QUEUE = 'attendance_events';

const startConsumer = async () => {
  try {
    const amqpUrl = process.env.AMQP_URL || 'amqp://guest:guest@attendance_broker:5672';
    
    const connection: Connection = await amqp.connect(amqpUrl);
    const channel: Channel = await connection.createChannel();

    await channel.assertQueue(ATTENDANCE_QUEUE, {
      durable: true,
    });

    console.log(`[Consumer] Waiting for messages in ${ATTENDANCE_QUEUE}. To exit press CTRL+C`);

    channel.consume(
      ATTENDANCE_QUEUE,
      async (message) => {
        if (message) {
          const success = await processMessage(message); 
          if (success) {
            channel.ack(message);
          } else {
            channel.nack(message, false, false);
          }
        }
      }
    );
  } catch (error) {
    console.error('[Consumer] Failed to start:', error);
    process.exit(1);
  }
};

startConsumer();