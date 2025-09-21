const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const s3 = new AWS.S3({
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'minioadmin',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'minioadmin',
  endpoint: process.env.S3_ENDPOINT || 'http://minio:9000',
  s3ForcePathStyle: true,
});

const ALLOWED_EXT = [".txt", ".jpg", ".jpeg", ".png", ".json"];

function makeKey(filename) {
  const uid = uuidv4();
  return `uploads/${uid}_${filename}`;
}

async function uploadFile(file) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_EXT.includes(ext)) {
    throw new Error("File type not allowed");
  }

  const key = makeKey(file.originalname);

  await s3
    .putObject({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
    .promise();

  return { key };
}

function generatePresignedUrl(key, expiresIn = 3600) {
  const externalS3 = new AWS.S3({
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'minioadmin',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'minioadmin',
    endpoint: 'http://localhost:9000',
    s3ForcePathStyle: true,
  });

  return externalS3.getSignedUrl("getObject", {
    Bucket: process.env.S3_BUCKET || 'my-minio-bucket',
    Key: key,
    Expires: expiresIn,
  });
}

module.exports = { uploadFile, generatePresignedUrl };
