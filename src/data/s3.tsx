import AWS from 'aws-sdk';

interface S3Config {
    accessKeyId: string;
    url: string;
    bucket: string;
    region: string;
}

const config: S3Config = {
    accessKeyId: '73SXHLKO4P9AI6AJYAXG',
    url: 'https://s3.csh.rit.edu',
    bucket: 'songarchive',
    region: 'us-east-1'
};

const s3: AWS.S3 = new AWS.S3({
    endpoint: config.url,
    s3ForcePathStyle: true,
    accessKeyId: config.accessKeyId,
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
