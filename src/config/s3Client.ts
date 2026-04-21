import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    ListObjectsV2Command,
} from "@aws-sdk/client-s3";

const s3 = new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT_URL as string,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY as string,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
    },
});


export const uploadImageInR2 = async (uniqueFileName: string, body: Buffer<ArrayBufferLike>, mimeType: string) => {
    // Upload a file
    await s3.send(
        new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: uniqueFileName,
            Body: body,
            ContentType: mimeType
        }),
    );
    // console.log(`Uploaded ${body}`);
}


export const getImageFromR2 = async(uniqueFileName: string) => {
    // Download a file
    const response = await s3.send(
        new GetObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: uniqueFileName,
        }),
    );

    const content = await response.Body?.transformToString();
    // console.log("Downloaded:", content);
}


export const createPublicUrl = (uniqueFileName: string) => {
    const publicUrl = process.env.R2_PUBLIC_URL + uniqueFileName;
    return publicUrl;
}

// const getAll

// // List objects
// const list = await s3.send(
//     new ListObjectsV2Command({
//         Bucket: process.env.R2_BUCKET_NAME,
//     }),
// );
// console.log(
//     "Objects:",
//     list.Contents.map((obj) => obj.Key),
// );