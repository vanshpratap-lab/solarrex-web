const scriptURL = 'https://script.google.com/macros/s/AKfycbxCNjq1lqZuJKCr8T-NB0oNmifr5XAxBsnFzzaySPLsYuDDoWIYhqLcdMgBDa7PBbj6/exec';

async function testSubmit() {
    const data = {
        Timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        Category: 'Residential',
        Name: 'Test Name',
        Email: 'test@example.com',
        WhatsApp: '1234567890',
        Pincode: '400001',
        HousingSociety: '',
        CompanyName: '',
        City: '',
        Designation: '',
        AverageMonthlyBill: '3500_4500'
    };

    const params = new URLSearchParams();
    for (const key in data) {
        params.append(key, data[key]);
    }

    try {
        const response = await fetch(scriptURL, {
            method: 'POST',
            body: params
        });
        const text = await response.text();
        console.log('Response status:', response.status);
        console.log('Response text:', text);
    } catch (e) {
        console.error('Error:', e);
    }
}

testSubmit();
