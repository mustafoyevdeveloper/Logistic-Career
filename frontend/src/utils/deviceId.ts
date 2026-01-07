/**
 * Device ID yaratish va saqlash
 * Bir xil telefondan boshqa brauzerdan kirish uchun:
 * - Telefon uchun bir xil deviceId (telefon fingerprint)
 * - Brauzer uchun alohida sessionId
 */
const DEVICE_ID_PREFIX = 'logistic_career_device_';
const SESSION_ID_PREFIX = 'logistic_career_session_';

/**
 * Telefon fingerprint yaratish (bir xil telefon uchun bir xil)
 */
const getPhoneFingerprint = (): string => {
  const fingerprintKey = 'logistic_career_phone_fingerprint';
  let fingerprint = localStorage.getItem(fingerprintKey);
  
  if (!fingerprint) {
    // Telefon uchun unique ID yaratish (screen size, platform, va boshqalar)
    const screenInfo = `${screen.width}x${screen.height}`;
    const platform = navigator.platform || 'unknown';
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 10);
    
    fingerprint = `phone_${screenInfo}_${platform}_${timestamp}_${random}`;
    localStorage.setItem(fingerprintKey, fingerprint);
  }
  
  return fingerprint;
};

/**
 * Session ID yaratish (har bir brauzer uchun alohida)
 */
const getSessionId = (email: string): string => {
  const key = `${SESSION_ID_PREFIX}${email.toLowerCase()}`;
  let sessionId = sessionStorage.getItem(key);
  
  if (!sessionId) {
    // Brauzer session uchun unique ID
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 15);
    sessionId = `session_${timestamp}_${random}`;
    sessionStorage.setItem(key, sessionId);
  }
  
  return sessionId;
};

export const getDeviceId = (email?: string): string => {
  if (!email) {
    // Email bo'lmasa, faqat telefon fingerprint
    return getPhoneFingerprint();
  }

  // Telefon fingerprint + email + session ID
  const phoneFingerprint = getPhoneFingerprint();
  const sessionId = getSessionId(email);
  
  // DeviceId: phoneFingerprint + email hash + sessionId
  // Bu bir xil telefondan boshqa brauzerdan kirishni imkoniyatini beradi
  const emailHash = email.toLowerCase().split('@')[0].substring(0, 8);
  const deviceId = `${phoneFingerprint}_${emailHash}_${sessionId}`;
  
  return deviceId;
};

/**
 * Device ID ni tozalash (logout yoki reset uchun)
 */
export const clearDeviceId = (email?: string): void => {
  if (email) {
    // Faqat shu email uchun sessionId ni tozalash
    const sessionKey = `${SESSION_ID_PREFIX}${email.toLowerCase()}`;
    sessionStorage.removeItem(sessionKey);
  } else {
    // Barcha sessionId larni tozalash
    const keys = Object.keys(sessionStorage);
    keys.forEach(key => {
      if (key.startsWith(SESSION_ID_PREFIX)) {
        sessionStorage.removeItem(key);
      }
    });
  }
  // Telefon fingerprint tozalanmaydi (bir xil telefon bo'lib qoladi)
};
