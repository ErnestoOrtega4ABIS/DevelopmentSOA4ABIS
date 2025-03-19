import amqp from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

const RABBITMQ_URL = "amqp://admin:admin@localhost";
const RABBIT_EXCHANGE = "client_event";  // Nombre del Exchange
const RABBIT_ROUTING_KEY = "client.created"; // Routing Key

export async function clientCreatedEvent(client) {
    const connection = await amqp.connect({
        protocol: 'amqp',
        hostname: process.env.RABBITMQ_HOST || 'localhost',
        port:5672,
        username: process.env.RABBITMQ_USER || 'user',
        password: process.env.RABBITMQ_PASSWORD || 'password',
    });
    const channel = await connection.createChannel();

    // Crear el Exchange si no existe (tipo topic)
    await channel.assertExchange(RABBIT_EXCHANGE, 'topic', { durable: true });

    // Convertir el cliente en JSON y publicarlo
    const message = JSON.stringify(client);
    channel.publish(RABBIT_EXCHANGE, RABBIT_ROUTING_KEY, Buffer.from(message));

    console.log(`Evento enviado a RabbitMQ -> Exchange "${RABBIT_EXCHANGE}", 
        Routing Key "${RABBIT_ROUTING_KEY}": ${message}`);

    setTimeout(() => {
        connection.close();
    }, 500);
}
