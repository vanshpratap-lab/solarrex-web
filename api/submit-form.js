// Serverless function proxy to protect Google Sheets Web App URL from client-side exposure.
// Deployed as /api/submit-form on Vercel.

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }

  const googleScriptUrl = process.env.GOOGLE_SCRIPT_URL;
  if (!googleScriptUrl) {
    console.error("GOOGLE_SCRIPT_URL environment variable is missing!");
    return res.status(500).json({ status: 'error', message: 'Server endpoint configuration missing.' });
  }

  try {
    // Determine input payload (form-urlencoded or json)
    let requestBody = '';
    if (typeof req.body === 'object') {
      const params = new URLSearchParams();
      for (const key in req.body) {
        params.append(key, req.body[key]);
      }
      requestBody = params.toString();
    } else {
      requestBody = req.body;
    }

    // Forward the payload to Google Sheets Web App
    const forwardResponse = await fetch(googleScriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: requestBody
    });

    const textData = await forwardResponse.text();
    let jsonData = {};
    try {
      jsonData = JSON.parse(textData);
    } catch (e) {
      jsonData = { raw: textData };
    }

    return res.status(200).json({ status: 'success', data: jsonData });
  } catch (error) {
    console.error("Proxy forwarding error:", error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
}
