import { S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { NodeHttpHandler } from '@smithy/node-http-handler';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import https from 'https';

// ES modules uchun __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env faylini backend papkasidan yuklash
dotenv.config({ path: join(__dirname, '../../.env') });

// Cloudflare R2 S3-compatible client
// Environment variables tekshiruvi
const r2AccountId = process.env.R2_ACCOUNT_ID;
const r2AccessKeyId = process.env.R2_ACCESS_KEY_ID;
const r2SecretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

if (!r2AccountId || !r2AccessKeyId || !r2SecretAccessKey) {
  console.warn('[R2] ⚠️ R2 credentials to\'liq emas:', {
    hasAccountId: !!r2AccountId,
    hasAccessKeyId: !!r2AccessKeyId,
    hasSecretAccessKey: !!r2SecretAccessKey,
  });
}

// HTTPS agent SSL/TLS muammolarini hal qilish uchun
// Cloudflare R2 uchun SSL/TLS sozlamalari
// Render.com'da SSL handshake muammosini hal qilish uchun
// Render.com'da SSL handshake muammosini hal qilish uchun, ehtimol,
// Node.js versiyasi yoki OpenSSL versiyasi bilan bog'liq bo'lishi mumkin
// Barcha variantlarni sinab ko'ramiz
const httpsAgent = new https.Agent({
  rejectUnauthorized: true,
  keepAlive: true,
  maxSockets: 50,
  // TLS versiyasini aniq belgilash - Render.com uchun
  // secureProtocol ishlatamiz (Node.js 12+ uchun)
  secureProtocol: 'TLSv1_2_method',
  // SSL handshake muammosini hal qilish uchun qo'shimcha sozlamalar
  // Cloudflare R2 uchun mos ciphers (string format)
  ciphers: 'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-DSS-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA',
  // SSL handshake muammosini hal qilish uchun qo'shimcha sozlamalar
  honorCipherOrder: true,
});

// R2 client - har safar yangi instance yaratish (SSL muammosini oldini olish uchun)
// AWS SDK v3'da requestHandler ni to'g'ri ishlatish uchun NodeHttpHandler ishlatamiz
const createR2Client = () => {
  // NodeHttpHandler orqali httpsAgent ni to'g'ri ishlatish
  const requestHandler = new NodeHttpHandler({
    httpsAgent,
  });

  return new S3Client({
    region: 'auto',
    endpoint: r2AccountId ? `https://${r2AccountId}.r2.cloudflarestorage.com` : undefined,
    credentials: {
      accessKeyId: r2AccessKeyId || '',
      secretAccessKey: r2SecretAccessKey || '',
    },
    requestHandler,
    forcePathStyle: false, // R2 uchun path-style emas, virtual-hosted style
  });
};

// Global client (fallback)
const r2Client = createR2Client();

/**
 * Faylni R2'ga yuklash
 * @param {Buffer} fileBuffer - Fayl buffer
 * @param {string} originalName - Original fayl nomi
 * @param {string} mimeType - MIME type (video/mp4, audio/mpeg, application/pdf, image/png, etc.)
 * @param {string} [folder='media'] - Bucket ichidagi papka nomi (media, certificates, va hokazo)
 * @returns {Promise<string>} - Public URL
 */
export const uploadToR2 = async (fileBuffer, originalName, mimeType, folder = 'media') => {
  try {
    // Environment variables tekshiruvi
    if (!process.env.R2_BUCKET || !process.env.R2_PUBLIC_BASE_URL) {
      throw new Error('R2_BUCKET va R2_PUBLIC_BASE_URL environment variable\'lar to\'ldirilishi kerak');
    }

    if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
      console.error('[R2] Missing credentials:', {
        hasAccountId: !!process.env.R2_ACCOUNT_ID,
        hasAccessKeyId: !!process.env.R2_ACCESS_KEY_ID,
        hasSecretAccessKey: !!process.env.R2_SECRET_ACCESS_KEY,
      });
      throw new Error('R2 credentials (R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY) to\'ldirilishi kerak');
    }

    // Fayl nomini yaratish (UUID + original extension)
    const fileExtension = originalName.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const key = `${folder}/${fileName}`;

    console.log('[R2] Uploading file:', {
      bucket: process.env.R2_BUCKET,
      key,
      size: fileBuffer.length,
      mimeType,
      folder,
    });

    // R2'ga yuklash
    // Note: R2'da ACL ishlamaydi, bucket public bo'lishi kerak
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: key,
      Body: fileBuffer,
      ContentType: mimeType,
    });

    // SSL handshake muammosini oldini olish uchun yangi client yaratish
    const client = createR2Client();
    await client.send(command);
    console.log('[R2] Upload successful');

    // Public URL
    const publicUrl = `${process.env.R2_PUBLIC_BASE_URL}/${key}`;
    return publicUrl;
  } catch (error) {
    console.error('[R2] Upload error:', error);
    console.error('[R2] Error details:', {
      name: error.name,
      message: error.message,
      code: error.Code || error.code,
      statusCode: error.$metadata?.httpStatusCode,
    });
    throw new Error(`R2'ga yuklashda xatolik: ${error.message || error.Code || 'Noma\'lum xatolik'}`);
  }
};

/**
 * R2'dan faylni o'chirish
 * @param {string} url - Public URL
 * @returns {Promise<boolean>}
 */
export const deleteFromR2 = async (url) => {
  try {
    if (!process.env.R2_BUCKET || !process.env.R2_PUBLIC_BASE_URL) {
      throw new Error('R2_BUCKET va R2_PUBLIC_BASE_URL environment variable\'lar to\'ldirilishi kerak');
    }

    // URL'dan key ni olish
    const baseUrl = process.env.R2_PUBLIC_BASE_URL;
    if (!url.startsWith(baseUrl)) {
      throw new Error('Noto\'g\'ri URL format');
    }

    const key = url.replace(baseUrl + '/', '');

    // R2'dan o'chirish
    const command = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: key,
    });

    await r2Client.send(command);
    return true;
  } catch (error) {
    console.error('R2 delete xatosi:', error);
    throw new Error(`R2'dan o'chirishda xatolik: ${error.message}`);
  }
};

/**
 * R2'dan fayl mavjudligini tekshirish
 * @param {string} url - Public URL
 * @returns {Promise<boolean>}
 */
export const checkFileExists = async (url) => {
  try {
    if (!process.env.R2_BUCKET || !process.env.R2_PUBLIC_BASE_URL) {
      return false;
    }

    const baseUrl = process.env.R2_PUBLIC_BASE_URL;
    if (!url.startsWith(baseUrl)) {
      return false;
    }

    const key = url.replace(baseUrl + '/', '');

    const command = new HeadObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: key,
    });

    await r2Client.send(command);
    return true;
  } catch (error) {
    return false;
  }
};
