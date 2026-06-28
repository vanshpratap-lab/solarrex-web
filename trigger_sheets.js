const scriptURL = 'https://script.google.com/macros/s/AKfycbxCNjq1lqZuJKCr8T-NB0oNmifr5XAxBsnFzzaySPLsYuDDoWIYhqLcdMgBDa7PBbj6/exec';

const forms = [
  {
    Category: 'Residential',
    Name: 'System Trigger',
    Email: 'auto@example.com',
    WhatsApp: '1234567890',
    Pincode: '400001',
    City: 'Mumbai',
    AverageMonthlyBill: '3500_4500'
  },
  {
    Category: 'Housing Society',
    Name: 'System Trigger',
    Email: 'auto@example.com',
    WhatsApp: '0987654321',
    Pincode: '400002',
    City: 'Pune',
    HousingSociety: 'Sunshine Residency',
    Designation: 'Secretary',
    AverageMonthlyBill: 'more_8000'
  },
  {
    Category: 'Commercial',
    Name: 'System Trigger',
    Email: 'auto@example.com',
    WhatsApp: '1112223334',
    Pincode: '400003',
    City: 'Delhi',
    CompanyName: 'Acme Solar Industries',
    AverageMonthlyBill: '4500_5500'
  }
];

async function triggerSheets() {
  for (const formData of forms) {
    const urlEncodedData = new URLSearchParams(formData).toString();
    console.log(`Sending trigger for: ${formData.Category}`);
    
    try {
        const response = await fetch(scriptURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: urlEncodedData
        });
        const result = await response.json();
        console.log(`Result for ${formData.Category}:`, result);
    } catch (e) {
        console.error('Failed to trigger:', e);
    }
  }
}

triggerSheets();
