// Serverless function proxy to protect Google Sheets Web App URL from client-side exposure.
// Deployed as /api/submit-form on Vercel.

// Fallback URL used when GOOGLE_SCRIPT_URL env var is not set in Vercel dashboard.
// This is safe — the function runs server-side and is never exposed to the browser.
const FALLBACK_GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxBI6KcoS1G_xZh9nRbjGxQ_iX-cdFd4egmyBe-8ql_tMk6SeLbmfW9om5iCnSMi0cN/exec';

export default async function handler(req, res) {
  // CORS Headers — restrict to the configured production domain, localhost, and Vercel preview domains.
  const origin = req.headers.origin || '';
  let allowedOrigin = 'https://solarrex.in';

  if (process.env.ALLOWED_ORIGIN) {
    allowedOrigin = process.env.ALLOWED_ORIGIN;
  } else if (
    origin === 'http://localhost:5173' ||
    origin === 'http://localhost:3000' ||
    origin.endsWith('.vercel.app') ||
    origin === 'https://solarrex.in' ||
    origin === 'https://www.solarrex.in'
  ) {
    allowedOrigin = origin;
  }

  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }

  // Guard against oversized payloads (max 50 KB)
  const MAX_BODY_SIZE = 50 * 1024;
  const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || '');
  if (rawBody.length > MAX_BODY_SIZE) {
    return res.status(413).json({ status: 'error', message: 'Request payload too large.' });
  }

  // Use env var if set in Vercel Dashboard, otherwise use embedded fallback.
  const googleScriptUrl = process.env.GOOGLE_SCRIPT_URL || FALLBACK_GOOGLE_SCRIPT_URL;

  try {
    // Determine input payload (form-urlencoded or json) & sanitize inputs against XSS/HTML Injection
    let requestBody = '';
    const sanitize = (val) => {
      if (typeof val !== 'string') return val;
      return val
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
    };

    if (typeof req.body === 'object') {
      const params = new URLSearchParams();
      for (const key in req.body) {
        params.append(key, sanitize(req.body[key]));
      }
      requestBody = params.toString();
    } else {
      // Parse query string or raw payload, sanitize, and reconstruct
      const tempParams = new URLSearchParams(req.body);
      const params = new URLSearchParams();
      for (const [key, value] of tempParams.entries()) {
        params.append(key, sanitize(value));
      }
      requestBody = params.toString();
    }

    // Backend validation for WhatsApp and Pincode
    const parsedParams = new URLSearchParams(requestBody);
    const whatsapp = parsedParams.get('WhatsApp');
    const pincode = parsedParams.get('Pincode');
    
    if (whatsapp && !/^\d{10}$/.test(whatsapp)) {
      return res.status(400).json({ status: 'error', message: 'Invalid WhatsApp number. Must be exactly 10 digits.' });
    }
    
    if (pincode && !/^\d{6}$/.test(pincode)) {
      return res.status(400).json({ status: 'error', message: 'Invalid Pincode. Must be exactly 6 digits.' });
    }

    // Forward the payload to Google Sheets Web App
    const forwardResponse = await fetch(googleScriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: requestBody
    });

    if (!forwardResponse.ok) {
      console.error("Google Sheets responded with error HTTP code:", forwardResponse.status);
      return res.status(502).json({ status: 'error', message: 'Upstream server returned an error.' });
    }

    const textData = await forwardResponse.text();
    let jsonData = {};
    try {
      jsonData = JSON.parse(textData);
    } catch (e) {
      jsonData = { raw: textData };
    }

    // Google Sheets apps script can return status or result or similar keys
    const googleStatus = (jsonData.status === 'success' || jsonData.result === 'success' || jsonData.status === 'OK') ? 'success' : 'error';
    const httpCode = googleStatus === 'success' ? 200 : 502;

    return res.status(httpCode).json({ 
      status: googleStatus, 
      data: jsonData,
      message: googleStatus === 'success' ? 'Logged successfully' : (jsonData.error || 'Google Sheets update failed')
    });
  } catch (error) {
    console.error("Proxy forwarding error:", error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
}
