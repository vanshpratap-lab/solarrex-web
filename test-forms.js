const scriptURL = 'https://script.google.com/macros/s/AKfycbx_s-m2U3E_2FLi8BPcZvM4c4gRsDqDaRZ2fd6vK72TEG7TiZ6Eywip0KaWQYWKWBKA/exec';

async function testForms() {
    console.log("Fetching Spreadsheet URL...");
    try {
        const getRes = await fetch(scriptURL);
        const getText = await getRes.text();
        console.log("Spreadsheet Info:", getText);
    } catch(e) {
        console.log("Could not GET spreadsheet url", e);
    }

    const testCases = [
        {
            Category: 'Residential',
            Name: 'John Doe (Test Residential)',
            WhatsApp: '9876543210',
            Pincode: '400001',
            AverageMonthlyBill: '2500_3500' // matches raw form value
        },
        {
            Category: 'Housing Society',
            Name: 'Jane Smith (Test Housing)',
            HousingSociety: 'Sunshine Apartments',
            Pincode: '400002',
            WhatsApp: '9876543211',
            Designation: 'committee', // matches raw form value
            AverageMonthlyBill: 'more_8000'
        },
        {
            Category: 'Commercial',
            Name: 'Acme Corp Contact (Test Commercial)',
            CompanyName: 'Acme Solar Industries',
            City: 'Mumbai',
            Pincode: '400003',
            WhatsApp: '9876543212',
            AverageMonthlyBill: '₹50,000 - ₹1,00,000' // matches raw form value for commercial select
        }
    ];

    for (let data of testCases) {
        console.log(`Submitting test for ${data.Category}...`);
        
        // Add timestamp exactly like frontend
        data.Timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

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
            console.log(`✅ Success for ${data.Category}:`, text);
        } catch (e) {
            console.error(`❌ Error for ${data.Category}:`, e);
        }
    }
}

testForms();
