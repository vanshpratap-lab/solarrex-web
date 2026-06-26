# Database & Storage Layer

This directory represents the **Database & Storage** layer of the Solar Rex stack.

## Architecture

- **Primary Storage**: Google Sheets
- **Database Engine**: Google Apps Script (Serverless execution environment)
- **Data Forwarding Protocol**: HTTPS POST (`application/x-www-form-urlencoded`)

## Files in this Directory

- [google-apps-script.js](file:///c:/Users/maste/OneDrive/Desktop/solarrex-web-Rudra/database-storage/google-apps-script.js): The production Google Apps Script backend sheet logging code.

## Setup Instructions

1. Create a blank Google Sheet.
2. Add the following headers in Row 1:
   `Timestamp`, `Category`, `Name`, `Email`, `WhatsApp`, `Pincode`, `HousingSociety`, `CompanyName`, `City`, `Designation`, `AverageMonthlyBill`.
3. Select **Extensions ➔ Apps Script**.
4. Paste the content of `google-apps-script.js` into the script editor.
5. Save, then click **Deploy ➔ New deployment**.
6. Set type to **Web App**, set Execute as to **Me**, and Set Access to **Anyone**.
7. Copy the generated Web App URL and set it as `GOOGLE_SCRIPT_URL` in the environment variables.
