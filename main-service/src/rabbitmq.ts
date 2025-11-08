import amqp, { Connection, Channel } from 'amqplib';

export const ATTENDANCE_QUEUE = 'attendance_events';

let connection: Connection | null = null;
let channel: Channel | null = null;

export const initRabbitMQ = async () => {
  try {
    const amqpUrl = process.env.AMQP_URL || 'amqp://guest:guest@attendance_broker:5672';

    const conn = await amqp.connect(amqpUrl);
    const ch = await conn.createChannel();

    await ch.assertQueue(ATTENDANCE_QUEUE, { durable: true });

    connection = conn;
    channel = ch;

    console.log('[RabbitMQ] Connected and queue asserted');
  } catch (error) {
    console.error('[RabbitMQ] Failed to connect:', error);
    process.exit(1);
  }
};

export const sendMessageToQueue = (queue: string, message: string) => {
  if (!channel) throw new Error('[RabbitMQ] Channel is not initialized');

  channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
  console.log(`[RabbitMQ] Sent message to ${queue}: ${message}`);
};