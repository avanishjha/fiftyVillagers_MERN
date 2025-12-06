const fs = require('fs');
const path = require('path');
// const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3'); // Uncomment when S3 is needed

const DRIVER = process.env.STORAGE_DRIVER || 'local';
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads');

const getBaseUrl = () => {
    // If BASE_URL is set (e.g. in production), use it.
    // Otherwise fallback to logical default for local dev.
    if (process.env.BASE_URL) return process.env.BASE_URL;
    const port = process.env.PORT || 5000;
    return `http://localhost:${port}`;
};

function getFileUrl(filename) {
    if (DRIVER === 's3') {
        const bucket = process.env.S3_BUCKET || 'your-bucket';
        const region = process.env.AWS_REGION || 'us-east-1';
        return `https://${bucket}.s3.${region}.amazonaws.com/uploads/${encodeURIComponent(filename)}`;
    }
    // Local driver
    return `${getBaseUrl()}/uploads/${encodeURIComponent(filename)}`;
}

async function deleteFile(filename) {
    if (DRIVER === 's3') {
        throw new Error('S3 delete not implemented yet');
        // const s3 = new S3Client({ region: process.env.AWS_REGION });
        // await s3.send(new DeleteObjectCommand({
        //     Bucket: process.env.S3_BUCKET,
        //     Key: `uploads/${filename}`
        // }));
    } else {
        // Local driver
        const filePath = path.join(UPLOAD_DIR, filename);
        if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
        }
    }
}

async function uploadLocalFromFile(filepath, filename) {
    // ensure upload dir exists
    if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

    // In a real 'upload' scenario where we simply want to return the URL for a file 
    // that might have been placed there by multerm we just return the URL.
    // If we were moving it from temp, we'd do fs.rename here.

    return { url: getFileUrl(filename), filename };
}

async function uploadS3FromBuffer(buffer, filename, contentType) {
    throw new Error('S3 driver not implemented yet');
    //   const s3 = new S3Client({ region: process.env.AWS_REGION });
    //   const cmd = new PutObjectCommand({
    //     Bucket: process.env.S3_BUCKET,
    //     Key: `uploads/${filename}`,
    //     Body: buffer,
    //     ContentType: contentType,
    //     ACL: 'public-read',
    //   });
    //   await s3.send(cmd);
    //   return { url: getFileUrl(filename), filename };
}

module.exports = {
    uploadLocalFromFile,
    uploadS3FromBuffer,
    getFileUrl,
    deleteFile,
    DRIVER,
    UPLOAD_DIR
};
