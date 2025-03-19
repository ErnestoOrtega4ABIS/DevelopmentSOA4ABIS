import amqp from 'amqplib';
import { createUsers } from '../controllers/userController.js';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'localhost';
const RABBIT_EXCHANGE = "client_event";
const RABBIT_ROUTING_KEY = "client.created";
const QUEUE_NAME = "user_service_queue";

export async function listenForClientEvents() {
    try {
        const connection = await amqp.connect({
            protocol: 'amqp',
            hostname: process.env.RABBITMQ_HOST, 
            port:5672,
            username: process.env.RABBITMQ_USER || 'user',
            password: process.env.RABBITMQ_PASSWORD || 'password',
        });
        
        const channel = await connection.createChannel();

        await channel.assertExchange(RABBIT_EXCHANGE, 'topic', { durable: true });

        const q = await channel.assertQueue(QUEUE_NAME, { durable: true });
        await channel.bindQueue(q.queue, RABBIT_EXCHANGE, RABBIT_ROUTING_KEY);

        console.log(`Escuchando eventos en "${RABBIT_EXCHANGE}" con Routing Key "${RABBIT_ROUTING_KEY}"...`);

        channel.consume(q.queue, async (msg) => {
            if (msg !== null) {
                try {
                    const clientData = JSON.parse(msg.content.toString());
                    console.log(`Evento recibido:`, clientData);

                    const fakeReq = { body: { 
                        phone: clientData.phone, 
                        username: clientData.email, 
                        password: "DefaultPass123!"  
                    }};
                    const fakeRes = {
                        status: (code) => ({
                            json: (data) => console.log(`Respuesta HTTP ${code}:`, data),
                        }),
                    };

                    await createUsers(fakeReq, fakeRes);

                    channel.ack(msg); 
                } catch (error) {
                    console.error("Error al procesar evento:", error);
                }
            }
        });

    } catch (error) {-
        console.error("Error al conectar con RabbitMQ:", error);
    }
}

