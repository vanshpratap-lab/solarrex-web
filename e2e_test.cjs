const puppeteer = require('puppeteer-core');
const { spawn } = require('child_process');
const path = require('path');

// Configure path to Chrome
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function runTest() {
  console.log("=== STARTING END-TO-END SUBMISSION TEST ===");
  
  // 1. Start Vite dev server in the background
  console.log("Step 1: Starting Vite dev server...");
  const devServer = spawn('npm', ['run', 'dev'], {
    cwd: 'c:\\Users\\maste\\OneDrive\\Desktop\\solar\\SOLAR-REX-webside',
    shell: true
  });

  let serverStarted = false;
  let serverPort = 5173;
  devServer.stdout.on('data', (data) => {
    const output = data.toString();
    const match = output.match(/http:\/\/localhost:(\d+)/);
    if (match) {
      serverPort = parseInt(match[1]);
      serverStarted = true;
    } else if (output.includes('http://localhost:') || output.includes('Local:')) {
      // General match fallback
      serverStarted = true;
    }
  });

  // Wait up to 10 seconds for the dev server to start
  for (let i = 0; i < 20; i++) {
    if (serverStarted) break;
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  if (!serverStarted) {
    console.error("FAILED STEP: Start Vite dev server timed out");
    devServer.kill();
    process.exit(1);
  }
  console.log("Vite dev server is running!");

  let browser;
  try {
    // 2. Launch browser using puppeteer-core
    console.log("Step 2: Launching Chrome...");
    browser = await puppeteer.launch({
      executablePath: chromePath,
      headless: true
    });

    const page = await browser.newPage();
    
    // Capture console output from the page
    const consoleLogs = [];
    page.on('console', msg => {
      const text = msg.text();
      consoleLogs.push(`[BROWSER CONSOLE] ${text}`);
      console.log(`[BROWSER CONSOLE] ${text}`);
    });

    // Capture network requests
    let submitFormRequestSent = false;
    let submitFormResponse = null;

    page.on('request', request => {
      if (request.url().includes('/api/submit-form')) {
        submitFormRequestSent = true;
        console.log("Network: Request sent to /api/submit-form");
      }
    });

    page.on('response', async response => {
      if (response.url().includes('/api/submit-form')) {
        submitFormResponse = {
          status: response.status(),
          body: await response.text()
        };
        console.log(`Network: Response received from /api/submit-form, Status: ${response.status()}`);
      }
    });

    // 3. Open index.html (localhost:5173)
    console.log("Step 3: Loading website homepage...");
    await page.goto(`http://localhost:${serverPort}`, { waitUntil: 'networkidle2' });

    // 4. Fill form with test data
    console.log("Step 4: Filling the Residential form...");
    
    // Wait for the form inputs
    await page.waitForSelector('#res-full-name');
    await page.type('#res-full-name', 'Rudra Test');

    
    await page.type('#res-whatsapp', '9876543210'); // 10 digits
    
    await page.type('#res-pincode', '452010'); // Indore Pincode
    
    // Wait for PIN Code Resolver to resolve city/state
    console.log("Waiting for PIN Code location resolution...");
    await page.waitForTimeout ? await page.waitForTimeout(3000) : await new Promise(r => setTimeout(r, 3000));
    
    // Select bill radio pill
    const billPill = await page.$('input[name="monthly_bill_res"][value="less_2500"]');
    if (billPill) {
      await page.evaluate(el => el.click(), billPill);
    }

    // Verify PIN code resolved badge exists
    const badgeText = await page.evaluate(() => {
      const badge = document.querySelector('.pincode-location-badge');
      return badge ? badge.textContent.trim() : 'NONE';
    });
    console.log("Pincode Resolution Badge:", badgeText);

    // 5. Submit Details click
    console.log("Step 5: Clicking Submit Details...");
    const submitButton = await page.$('.btn-submit-contact');
    if (!submitButton) {
      throw new Error("Submit button not found");
    }
    
    await page.evaluate(el => el.click(), submitButton);

    // Wait for network response and popup to activate
    console.log("Waiting for submission pipeline completion...");
    await page.waitForTimeout ? await page.waitForTimeout(5000) : await new Promise(r => setTimeout(r, 5000));

    // Check form success visual indicators
    const formState = await page.evaluate(() => {
      const msgDiv = document.querySelector('.form-submit-message');
      const submitBtn = document.querySelector('.btn-submit-contact');
      return {
        successMessageVisible: msgDiv ? (msgDiv.style.opacity === '1' || msgDiv.textContent.includes("Done")) : false,
        successMessageText: msgDiv ? msgDiv.innerText.trim() : '',
        buttonText: submitBtn ? submitBtn.innerText.trim() : ''
      };
    });

    console.log("=== VERIFICATION CHECKLIST ===");
    
    // Verify 1: API Request Sent
    console.log(`1. API Request /api/submit-form sent: ${submitFormRequestSent ? 'PASSED' : 'FAILED'}`);

    // Verify 2: API Response Status
    const responseStatusPassed = submitFormResponse && submitFormResponse.status === 200;
    console.log(`2. API Response Status is 200: ${responseStatusPassed ? 'PASSED' : 'FAILED'} (Got: ${submitFormResponse ? submitFormResponse.status : 'N/A'})`);

    // Verify 3: Google Apps Script Response
    let appsScriptPassed = false;
    if (submitFormResponse) {
      try {
        const bodyObj = JSON.parse(submitFormResponse.body);
        appsScriptPassed = bodyObj.status === 'success' || bodyObj.data.status === 'success';
        console.log(`3. Apps Script Success: ${appsScriptPassed ? 'PASSED' : 'FAILED'} (Body: ${submitFormResponse.body})`);
      } catch (e) {
        console.log(`3. Apps Script Success: FAILED (Failed to parse response body: ${submitFormResponse.body})`);
      }
    } else {
      console.log(`3. Apps Script Success: FAILED (No response received)`);
    }

    // Verify 4: Success Message Shown
    console.log(`4. Success Message Visible: ${formState.successMessageVisible ? 'PASSED' : 'FAILED'}`);
    console.log(`   Message Text: "${formState.successMessageText}"`);

    // Verify 5: Button Success Status
    const buttonPassed = formState.buttonText.includes("Done") || formState.buttonText.includes("✅");
    console.log(`5. Submit Button Text contains Done/Checkmark: ${buttonPassed ? 'PASSED' : 'FAILED'} (Got: "${formState.buttonText}")`);

    const allPassed = submitFormRequestSent && responseStatusPassed && appsScriptPassed && formState.successMessageVisible && buttonPassed;
    if (allPassed) {
      console.log("\n*** E2E TEST PASSED SUCCESSFULLY! ***");
    } else {
      console.log("\n*** E2E TEST FAILED! ***");
      process.exit(1);
    }

  } catch (err) {
    console.error("Error running test:", err);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
    // Kill dev server
    console.log("Shutting down Vite dev server...");
    devServer.kill();
  }
}

runTest();
