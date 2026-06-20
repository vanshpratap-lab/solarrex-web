/**
 * Google Apps Script doPost handler for Solar Rex lead capture
 * Deploy as a Web App:
 * 1. Open Google Sheets -> Extensions -> Apps Script
 * 2. Paste this code and click Save
 * 3. Deploy -> New deployment -> Select type: Web App
 * 4. Configure: Execute as "Me", Who has access: "Anyone"
 * 5. Copy the Web App URL and set it as GOOGLE_SCRIPT_URL env variable
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var parameter = e.parameter;
    
    var timestamp = new Date();
    var category = parameter.category || '';
    var name = parameter.name || '';
    var email = parameter.email || '';
    var whatsapp = parameter.whatsapp || '';
    var pincode = parameter.pincode || '';
    var housingSociety = parameter.housingSociety || '';
    var companyName = parameter.companyName || '';
    var city = parameter.city || '';
    var designation = parameter.designation || '';
    var averageMonthlyBill = parameter.averageMonthlyBill || '';
    
    // Append lead record to Sheet
    sheet.appendRow([
      timestamp, 
      category, 
      name, 
      email, 
      whatsapp, 
      pincode, 
      housingSociety, 
      companyName, 
      city, 
      designation, 
      averageMonthlyBill
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Lead recorded successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
