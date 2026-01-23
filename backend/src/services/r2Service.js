import { S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
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

// R2 TLS muammolari uchun ixtiyoriy "insecure" rejim.
// Default: xavfsiz (rejectUnauthorized=true) va AWS SDK default sozlamalari.
// Agar Render muhitida SSL handshake muammosi bo‘lsa, Render Environment'ga:
//   R2_INSECURE_TLS=true
// deb qo‘yib ko‘ring (faqat vaqtincha diagnostika uchun).
// Development'da avtomatik ravishda insecure rejimni ishlatamiz (SSL muammosini hal qilish uchun)
const isDevelopment = process.env.NODE_ENV !== 'production';
const r2InsecureTls = String(process.env.R2_INSECURE_TLS || '').toLowerCase() === 'true' || isDevelopment;

// Windows'da SSL muammosini hal qilish uchun NODE_TLS_REJECT_UNAUTHORIZED ni o'rnatish
if (r2InsecureTls && typeof process.env.NODE_TLS_REJECT_UNAUTHORIZED === 'undefined') {
  // Faqat development'da va agar o'rnatilmagan bo'lsa
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  console.log('[R2] ⚠️ NODE_TLS_REJECT_UNAUTHORIZED=0 o\'rnatildi (development mode)');
}

// Windows'da SSL handshake muammosini hal qilish uchun
// OpenSSL 3.5+ bilan muammo bo'lishi mumkin, shuning uchun qo'shimcha sozlamalar
const httpsAgent = r2InsecureTls
  ? new https.Agent({
      rejectUnauthorized: false,
      keepAlive: true,
      maxSockets: 50,
      // Windows'da SSL handshake muammosini hal qilish uchun
      // TLS versiyasini aniq belgilash
      minVersion: 'TLSv1.2',
      maxVersion: 'TLSv1.3',
      // Windows'da muammo bo'lishi mumkin, shuning uchun qo'shimcha sozlamalar
      secureProtocol: undefined, // Default protocol ishlatish
      // Cipher suites'ni o'zgartirish (string format)
      ciphers: 'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-DSS-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA',
      honorCipherOrder: true,
    })
  : undefined;

// R2 client - har safar yangi instance yaratish (SSL muammosini oldini olish uchun)
// AWS SDK v3'da requestHandler ni to'g'ri ishlatish uchun NodeHttpHandler ishlatamiz
const createR2Client = () => {
  const baseConfig = {
    region: 'auto',
    endpoint: r2AccountId ? `https://${r2AccountId}.r2.cloudflarestorage.com` : undefined,
    credentials: {
      accessKeyId: r2AccessKeyId || '',
      secretAccessKey: r2SecretAccessKey || '',
    },
    forcePathStyle: false, // R2 uchun path-style emas, virtual-hosted style
  };

  // Faqat insecure rejimda custom httpsAgent ishlatamiz
  if (httpsAgent) {
    const requestHandler = new NodeHttpHandler({ httpsAgent });
    return new S3Client({ ...baseConfig, requestHandler });
  }

  return new S3Client(baseConfig);
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
    console.log('[R2] Runtime info:', {
      node: process.version,
      openssl: process.versions?.openssl,
      insecureTls: r2InsecureTls,
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

/**
 * R2'dan faylni o'qib olish (proxy uchun)
 * @param {string} url - Public URL
 * @returns {Promise<{buffer: Buffer, contentType: string}>}
 */
export const downloadFromR2 = async (url) => {
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

    // R2'dan o'qib olish
    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: key,
    });

    const client = createR2Client();
    const response = await client.send(command);
    
    // Stream'ni buffer'ga o'tkazish
    const chunks = [];
    for await (const chunk of response.Body) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    return {
      buffer,
      contentType: response.ContentType || 'application/octet-stream',
    };
  } catch (error) {
    console.error('[R2] Download error:', error);
    throw new Error(`R2'dan o'qib olishda xatolik: ${error.message}`);
  }
};
