const http = require('http');
const fs = require('fs');
const path = require('path');
const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, 'dist', req.url === '/' ? 'index.html' : req.url);
    if (!fs.existsSync(filePath)) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200);
    res.end(fs.readFileSync(filePath));
});
server.listen(5000, async () => {
    try {
        const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
        const puppeteer = require('puppeteer-core');
        const browser = await puppeteer.launch({ executablePath: chromePath, headless: true });
        const page = await browser.newPage();
        page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
        page.on('pageerror', err => console.log('BROWSER ERROR:', err.toString()));
        await page.goto('http://localhost:5000', { waitUntil: 'networkidle0' });
        
        await page.type('input[name="name"]', 'Test User');
        await page.type('input[name="whatsapp"]', '9999999999');
        await page.type('input[name="pincode"]', '110001');
        
        console.log('Clicking submit...');
        await page.click('button[type="submit"]');
        
        await new Promise(r => setTimeout(r, 2000));
        await browser.close();
    } catch(e) {
        console.error('Puppeteer failed:', e);
    }
    server.close();
});
