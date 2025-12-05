const fs = require('fs');
const path = require('path');
// const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3'); // Uncomment when S3 is needed

const DRIVER = process.env.STORAGE_DRIVER || 'local';
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads');

async function uploadLocalFromFile(filepath, filename) {
    // ensure upload dir exists
    if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

    // Use BASE_URL if defined, otherwise fallback to relative path (which works for proxy)
    // The review suggested using BASE_URL to avoid hardcoded localhost and support absolute URLs
    const baseUrl = process.env.BASE_URL || '';
    return { url: `${baseUrl}/uploads/${encodeURIComponent(filename)}`, filename };
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
    //   return { url: `https://${process.env.S3_BUCKET}.s3.amazonaws.com/uploads/${encodeURIComponent(filename)}`, filename };
}

module.exports = {
    uploadLocalFromFile,
    uploadS3FromBuffer,
    DRIVER,
};
