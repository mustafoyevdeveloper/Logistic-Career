import express from 'express';

const router = express.Router();

// HTTP backend'larni proxy qilish uchun endpoint
// Bu mixed content muammosini hal qiladi
router.all('/*', async (req, res) => {
  try {
    // Proxy target URL'ni query parametrdan olish
    const targetUrl = req.query.target;
    
    if (!targetUrl) {
      return res.status(400).json({
        success: false,
        message: 'Target URL parametr kerak (?target=http://...)',
      });
    }

    // URL'ni tozalash va validatsiya qilish
    let cleanUrl = decodeURIComponent(targetUrl).trim();
    
    // Faqat HTTP va HTTPS URL'larni ruxsat berish
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      return res.status(400).json({
        success: false,
        message: 'Target URL http:// yoki https:// bilan boshlanishi kerak',
      });
    }

    // Xavfsizlik: faqat ruxsat berilgan domain'larni proxy qilish
    const allowedDomains = [
      '163.245.212.101',
      'localhost',
      '127.0.0.1',
    ];
    
    const urlObj = new URL(cleanUrl);
    const isAllowed = allowedDomains.some(domain => 
      urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`)
    );

    if (!isAllowed) {
      return res.status(403).json({
        success: false,
        message: 'Bu domain uchun proxy ruxsati yo\'q',
      });
    }

    // Endpoint'ni olish (req.path'dan /api/proxy qismini olib tashlash)
    // Masalan: /api/proxy/auth/login -> /auth/login
    let endpoint = req.path;
    if (endpoint.startsWith('/api/proxy')) {
      endpoint = endpoint.replace(/^\/api\/proxy/, '');
    }
    if (!endpoint || endpoint === '/') {
      endpoint = '';
    }
    
    // Base URL'ni tozalash (oxiridagi / ni olib tashlash)
    const baseUrl = cleanUrl.replace(/\/$/, '');
    const fullUrl = baseUrl + endpoint;

    // Query parametrlarni qo'shish (target'ni olib tashlash)
    const queryParams = { ...req.query };
    delete queryParams.target; // target parametrni olib tashlash
    
    const queryString = new URLSearchParams(queryParams).toString();
    const finalUrl = queryString ? `${fullUrl}?${queryString}` : fullUrl;

    // Original request'dan header'larni olish
    const headers = { ...req.headers };
    
    // Host header'ni olib tashlash (target server uchun)
    delete headers.host;
    delete headers['content-length'];
    
    // Request body'ni olish
    let body = null;
    if (req.body && Object.keys(req.body).length > 0) {
      body = JSON.stringify(req.body);
      headers['content-type'] = 'application/json';
    } else if (req.body && typeof req.body === 'string') {
      body = req.body;
    }

    // Fetch orqali proxy so'rov yuborish
    const fetchOptions = {
      method: req.method,
      headers: headers,
    };

    if (body) {
      fetchOptions.body = body;
    }

    const response = await fetch(finalUrl, fetchOptions);

    // Response header'larni olish va CORS header'larini qo'shish
    const responseHeaders = {};
    const origin = req.headers.origin || '*';
    
    // CORS header'larini qo'shish
    responseHeaders['Access-Control-Allow-Origin'] = origin;
    responseHeaders['Access-Control-Allow-Credentials'] = 'true';
    responseHeaders['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, PATCH, OPTIONS';
    responseHeaders['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Device-ID, Accept, Origin, X-Requested-With';
    
    // Original response header'larini qo'shish (CORS header'larni override qilmaslik)
    response.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();
      // CORS header'larni skip qilish (yuqorida qo'shildi)
      if (lowerKey.startsWith('access-control-')) {
        return;
      }
      responseHeaders[key] = value;
    });

    // Response body'ni olish
    const contentType = response.headers.get('content-type');
    let responseData;

    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else if (contentType && contentType.includes('text/')) {
      responseData = await response.text();
    } else {
      // Binary data uchun
      responseData = await response.arrayBuffer();
      res.set('Content-Type', contentType || 'application/octet-stream');
      return res.status(response.status).send(Buffer.from(responseData));
    }

    // Response'ni yuborish
    res.status(response.status);
    Object.keys(responseHeaders).forEach(key => {
      res.set(key, responseHeaders[key]);
    });
    res.json(responseData);

  } catch (error) {
    console.error('❌ Proxy xatolik:', error);
    res.status(500).json({
      success: false,
      message: 'Proxy xatolik: ' + error.message,
    });
  }
});

export default router;
