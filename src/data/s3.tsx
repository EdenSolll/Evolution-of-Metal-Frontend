import AWS from 'aws-sdk';
import dotenv from 'dotenv'; // Make sure to install this package if you haven't already

// Load environment variables
dotenv.config();

interface S3Config {
    accessKeyId: string;
    secretAccessKey: string;
    url: string;
    bucket: string;
    region: string;
}

const config: S3Config = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    url: process.env.AWS_S3_ENDPOINT!,
    bucket: process.env.AWS_S3_BUCKET_NAME!,
    region: process.env.AWS_REGION!
};

const s3: AWS.S3 = new AWS.S3({
    endpoint: config.url,
    s3ForcePathStyle: true,
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    region: config.region
});

export function getUrl(id: string): Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            const params = {
                Bucket: config.bucket,
                Key: id,
                ResponseContentType: 'audio/mpeg',
            };
            s3.getSignedUrl('getObject', params, (err, data) => {
                if (err) {
                    console.error("Failed to get signed URL:", err);
                    reject(err);
                } else {
                    resolve(data as string);
                }
            });
        } catch (error) {
            console.error("Error in getUrl:", error);
            reject(error);
        }
    });
}

export { config, s3 };
