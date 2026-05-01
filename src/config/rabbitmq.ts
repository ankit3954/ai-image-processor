import amqp, { type Channel, type Connection } from "amqplib"

let channel: Channel | null = null;
let connection: Connection | null = null;

export const connectQueue = async() => {
    try {
        if(channel){
            return channel
        }

        const rabbitUrl = process.env.RABBITMQ_URL || "amqp://127.0.0.1:5672";
        connection = await amqp.connect(rabbitUrl);
        console.log("RabbitMQ Connection Established");

         if (!connection) {
            throw new Error("Failed to establish connection");
        }

        channel = await connection.createChannel();

        const queueName = 'image_processing_tasks';

        await channel.assertQueue(queueName, { durable: true });
        console.log(`📦 Queue Ready: ${queueName}`);

        return channel

    } catch (error) {
        console.log(error)
    }
}


export const getChannel = (): Channel => {
    if (!channel) {
        throw new Error("RabbitMQ Channel is not open. You must run connectQueue() first.");
    }
    return channel;
};

