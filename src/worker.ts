import 'dotenv/config';
import { connectQueue } from "./config/rabbitmq.js"
import { createPublicUrl, getImageFromR2, uploadImageInR2 } from "./config/s3Client.js";
import Image from "./modules/image/image.model.js";
import { transformationEngine } from "./utils/transformationEngine.utils.js";
import connectDB from './config/database.js';

const startWorker = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await connectDB();
        const channel = await connectQueue();
        const queueName = "image_processing_tasks";

        if (!channel) {
            console.log("Problem while creating channel in worker")
            return;
        }

        await channel.assertQueue(queueName, { durable: true });

        channel.prefetch(1);
        console.log(`Worker is now listening for tickets in [${queueName}]...`);


        channel.consume(queueName, async (msg) => {
            if (!msg) {
                return;
            }

            try {
                const rawData = msg.content.toString();
                const task = JSON.parse(rawData);
                const { transformations, fingerPrint, originalFileName, imageId, userId, mimetype } = task;

                console.log(`Downloading from Cloudflare R2...`);
                const originalImagePath = await getImageFromR2(originalFileName);
                if (!originalImagePath) {
                    throw { status: 404, message: "Failed to save image record." };
                }

                console.log(`Running Sharp Pipeline...`);
                const { buffer, newFileName } = await transformationEngine(originalImagePath, transformations, imageId);
                await uploadImageInR2(newFileName, buffer, mimetype);
                const publicUrl = createPublicUrl(newFileName);


                console.log(`Updating MongoDB to 'completed'...`);
                const imageDoc = await Image.findOne({
                    _id: imageId
                });

                if (imageDoc) {
                    imageDoc.status = "completed"
                    imageDoc.derivedImages.push({
                        url: publicUrl,
                        fileName: newFileName,
                        transformations: transformations,
                        fingerPrint: fingerPrint
                    });
                    await imageDoc.save();
                }

                channel.ack(msg);
                console.log(`Job ${fingerPrint} acknowledged and deleted from queue.`);
            } catch (processingError) {
                console.error("Failed to process image:", processingError);
                channel.ack(msg);
            }
        })

    } catch (error) {
        console.error("Fatal Worker Error:", error);
        process.exit(1);
    }
}

startWorker();