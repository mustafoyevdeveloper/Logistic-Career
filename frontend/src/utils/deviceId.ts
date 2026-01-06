/**
 * Device ID yaratish va saqlash
 * Har bir qurilma uchun unique ID
 */
const DEVICE_ID_KEY = 'logistic_career_device_id';

export const getDeviceId = (): string => {
  // LocalStorage'dan olish
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);

  // Agar yo'q bo'lsa, yangi yaratish
  if (!deviceId) {
    // Unique ID yaratish
    deviceId = generateUniqueId();
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
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
export const clearDeviceId = (): void => {
  localStorage.removeItem(DEVICE_ID_KEY);
};

