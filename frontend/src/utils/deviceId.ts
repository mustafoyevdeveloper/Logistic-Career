/**
 * Device ID yaratish va saqlash
 * Har bir browser session uchun unique ID
 * Har bir email uchun alohida deviceId (bir qurilmada bir nechta accountdan kirish mumkin)
 */
const DEVICE_ID_PREFIX = 'logistic_career_device_';

export const getDeviceId = (email?: string): string => {
  // Agar email berilgan bo'lsa, email-ga bog'liq deviceId
  // Agar email berilmagan bo'lsa, umumiy deviceId
  const key = email 
    ? `${DEVICE_ID_PREFIX}${email.toLowerCase()}`
    : `${DEVICE_ID_PREFIX}default`;

  // LocalStorage'dan olish
  let deviceId = localStorage.getItem(key);

  // Agar yo'q bo'lsa, yangi yaratish
  if (!deviceId) {
    // Unique ID yaratish (browser session + timestamp + random)
    deviceId = generateUniqueId();
    localStorage.setItem(key, deviceId);
  }

  return deviceId;
};

/**
 * Unique ID yaratish
 */
const generateUniqueId = (): string => {
  // Browser fingerprint + timestamp + random
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 15);
  const userAgent = navigator.userAgent.replace(/\s+/g, '').substring(0, 10);
  
  return `${timestamp}-${random}-${userAgent}`;
};

/**
 * Device ID ni tozalash (logout yoki reset uchun)
 */
export const clearDeviceId = (email?: string): void => {
  if (email) {
    // Faqat shu email uchun deviceId ni tozalash
    const key = `${DEVICE_ID_PREFIX}${email.toLowerCase()}`;
    localStorage.removeItem(key);
  } else {
    // Barcha deviceId larni tozalash
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(DEVICE_ID_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }
};

