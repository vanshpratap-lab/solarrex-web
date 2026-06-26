import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    root: 'frontend',
    plugins: [
      {
        name: 'api-proxy-plugin',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url === '/api/submit-form' && req.method === 'POST') {
              let body = '';
              req.on('data', (chunk) => {
                body += chunk;
              });
              req.on('end', async () => {
                try {
                  let payload = {};
                  try {
                    payload = JSON.parse(body || '{}');
                  } catch (e) {
                    const searchParams = new URLSearchParams(body);
                    for (const [key, value] of searchParams.entries()) {
                      payload[key] = value;
                    }
                  }
                  const googleScriptUrl = env.GOOGLE_SCRIPT_URL;

                  if (!googleScriptUrl) {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ 
                      status: 'error', 
                      message: 'GOOGLE_SCRIPT_URL environment variable is missing from .env' 
                    }));
                    return;
                  }

                  const params = new URLSearchParams();
                  const sanitize = (val) => {
                    if (typeof val !== 'string') return val;
                    return val
                      .replace(/&/g, '&amp;')
                      .replace(/</g, '&lt;')
                      .replace(/>/g, '&gt;')
                      .replace(/"/g, '&quot;')
                      .replace(/'/g, '&#x27;');
                  };

                  for (const key in payload) {
                    params.append(key, sanitize(payload[key]));
                  }

                  const whatsapp = params.get('WhatsApp');
                  const pincode = params.get('Pincode');

                  if (whatsapp && !/^\d{10}$/.test(whatsapp)) {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ status: 'error', message: 'Invalid WhatsApp number. Must be exactly 10 digits.' }));
                    return;
                  }

                  if (pincode && !/^\d{6}$/.test(pincode)) {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ status: 'error', message: 'Invalid Pincode. Must be exactly 6 digits.' }));
                    return;
                  }

                  const forwardResponse = await fetch(googleScriptUrl, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: params.toString()
                  });

                  if (!forwardResponse.ok) {
                    res.statusCode = 502;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ 
                      status: 'error', 
                      message: 'Google Sheets returned an error response.' 
                    }));
                    return;
                  }

                  const textData = await forwardResponse.text();
                  let jsonData = {};
                  try {
                    jsonData = JSON.parse(textData);
                  } catch (e) {
                    jsonData = { raw: textData };
                  }

                  const googleStatus = (jsonData.status === 'success' || jsonData.result === 'success' || jsonData.status === 'OK') ? 'success' : 'error';
                  res.statusCode = googleStatus === 'success' ? 200 : 502;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({
                    status: googleStatus,
                    data: jsonData,
                    message: googleStatus === 'success' ? 'Logged successfully' : (jsonData.error || 'Google Sheets update failed')
                  }));
                } catch (err) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ status: 'error', message: err.message }));
                }
              });
            } else {
              next();
            }
          });
        }
      }
    ],
    server: {},
    build: {
      outDir: '../dist',
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'frontend/index.html'),
          solutions: resolve(__dirname, 'frontend/solutions.html'),
        },
      },
    },
  };
});
