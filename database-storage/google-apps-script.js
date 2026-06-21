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
    var parameter = e.parameter;
    
    // Support both TitleCase and camelCase parameter names for maximum robustness
    var timestamp = parameter.Timestamp || parameter.timestamp || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    var category = parameter.Category || parameter.category || 'General';
    var name = parameter.Name || parameter.name || '';
    var email = parameter.Email || parameter.email || '';
    var whatsapp = parameter.WhatsApp || parameter.whatsapp || '';
    var pincode = parameter.Pincode || parameter.pincode || '';
    var housingSociety = parameter.HousingSociety || parameter.housingSociety || '';
    var companyName = parameter.CompanyName || parameter.companyName || '';
    var city = parameter.City || parameter.city || '';
    var designation = parameter.Designation || parameter.designation || '';
    var averageMonthlyBill = parameter.AverageMonthlyBill || parameter.averageMonthlyBill || '';
    
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(category);
    if (!sheet) {
      sheet = ss.insertSheet(category);
    }
    
    // Determine headers and row content based on category
    var headers = [];
    var rowData = [];
    
    // Format the average monthly bill for humans
    var formattedBill = averageMonthlyBill;
    if (averageMonthlyBill === 'less_2500') formattedBill = 'Less than ₹2,500';
    else if (averageMonthlyBill === '2500_3500') formattedBill = '₹2,500 - ₹3,500';
    else if (averageMonthlyBill === '3500_4500') formattedBill = '₹3,500 - ₹4,500';
    else if (averageMonthlyBill === '4500_5500') formattedBill = '₹4,500 - ₹5,500';
    else if (averageMonthlyBill === 'more_8000') formattedBill = 'More than ₹8,000';

    if (category === 'Residential') {
      headers = [
        'Date & Time',
        'Full Name',
        'WhatsApp Number',
        'Pincode',
        'Monthly Electricity Bill'
      ];
      rowData = [
        timestamp,
        name,
        whatsapp,
        pincode,
        formattedBill
      ];
    } else if (category === 'Housing Society') {
      headers = [
        'Date & Time',
        'Full Name',
        'Housing Society Name',
        'Designation / Role',
        'WhatsApp Number',
        'Pincode',
        'Monthly Electricity Bill'
      ];
      rowData = [
        timestamp,
        name,
        housingSociety,
        designation,
        whatsapp,
        pincode,
        formattedBill
      ];
    } else if (category === 'Commercial') {
      headers = [
        'Date & Time',
        'Full Name',
        'Company Name',
        'WhatsApp Number',
        'City / Location',
        'Monthly Electricity Bill'
      ];
      rowData = [
        timestamp,
        name,
        companyName,
        whatsapp,
        city,
        formattedBill
      ];
    } else if (category === 'Mini Form') {
      headers = [
        'Date & Time',
        'Full Name',
        'Email Address',
        'WhatsApp Number',
        'Monthly Electricity Bill'
      ];
      rowData = [
        timestamp,
        name,
        email,
        whatsapp,
        formattedBill
      ];
    } else {
      // General fallback
      headers = [
        'Date & Time',
        'Full Name',
        'Email Address',
        'WhatsApp Number',
        'Pincode',
        'City / Location',
        'Monthly Electricity Bill'
      ];
      rowData = [
        timestamp,
        name,
        email,
        whatsapp,
        pincode,
        city,
        formattedBill
      ];
    }
    
    // Check if headers exist, if not, write them
    var lastRow = sheet.getLastRow();
    if (lastRow === 0) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
      // Optional: Give some styling to headers
      sheet.getRange(1, 1, 1, headers.length).setBackground("#d9ead3");
    }
    
    // Write data
    var targetRow = lastRow + 1;
    if (lastRow === 1) {
      targetRow = 3; // Leave a blank line after headers
    }
    
    // Ensure array length matches column length
    var targetRange = sheet.getRange(targetRow, 1, 1, rowData.length);
    targetRange.setValues([rowData]);
    
    // Auto-resize columns for readability
    for (var i = 1; i <= headers.length; i++) {
      sheet.autoResizeColumn(i);
    }
    
    // Make sure we successfully got here
    var url = SpreadsheetApp.getActiveSpreadsheet().getUrl();
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      spreadsheetUrl: url,
      message: 'Lead recorded successfully!'
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString(),
      stack: error.stack
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Added this function in case you want to test GET requests
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'Solar Rex Script is active! Ready to receive POST data.'
  })).setMimeType(ContentService.MimeType.JSON);
}
