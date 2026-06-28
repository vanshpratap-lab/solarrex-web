// --- Solar Rex Solutions Detail Page Logic ---

// 1. Solution Content Datasets
const solutionData = {
    'residential-solar': {
        title: 'Residential Solar Solutions',
        subtitle: 'Power Your Home, Secure Your Independence',
        tagline: 'Slash your electricity bills, get 24/7 backup power, and qualify for 100% government subsidy (DCR compliant).',
        image: 'images/categories/cat_residential.png',
        overview: 'Power your home with clean, sustainable energy. Our residential solutions combine high-efficiency panels with smart storage to ensure your family never stays in the dark. We handle the entire engineering, procurement, utility approval, net metering, and subsidy paperwork for a seamless, hassle-free solar transition.',
        highlights: [
            '24/7 Backup Power integration with smart lithium battery storage',
            'Smart Mobile Monitoring for real-time generation and load tracking',
            '25-Year Performance Warranty on top-tier N-Type TOPCon modules',
            '100% DCR Compliant materials matching government subsidy rules'
        ],
        specRange: '3 kW to 15 kW',
        specModule: 'N-Type TOPCon Half-Cut',
        specWatt: '580W - 680W',
        specEfficiency: 'Up to 22.8% (N-Type TOPCon Half-Cut)',
        specInverter: 'Solar Rex Smart String Inverter (Grid-Tied)',
        specStorage: '5 kWh - 15 kWh LFP Storage (Optional Upgrade)',
        specPayback: '3 - 4 Years',
        specCompliance: '100% DCR Compliant (Subsidy Eligible)',
        calcBadge: 'Residential Solar',
        calcInstruction: 'Adjust the slider below to select your system size and calculate estimated costs, government subsidy, and monthly returns.',
        calcNote: '*Government subsidies are strictly available for domestic content requirement (DCR) systems proudly manufactured in India. Solar Rex guarantees 100% compliant materials.',
        calcLabel: 'Govt. Subsidy (DCR)',
        sliderValues: [3, 5, 8, 10, 15],
        calculatorEngine: (kw) => {
            const dataMap = {
                3: { cost: 190000, subsidy: 78000, savings: '₹3.0K - ₹3.6K' },
                5: { cost: 290000, subsidy: 78000, savings: '₹5.0K - ₹6.0K' },
                8: { cost: 380000, subsidy: 78000, savings: '₹8.0K - ₹9.6K' },
                10: { cost: 450000, subsidy: 78000, savings: '₹10K - ₹12K' },
                15: { cost: 510000, subsidy: 78000, savings: '₹15K - ₹18K' }
            };
            const d = dataMap[kw] || dataMap[10];
            return {
                cost: d.cost,
                subsidy: d.subsidy,
                net: d.cost - d.subsidy,
                savings: d.savings
            };
        },
        faqs: [
            {
                q: 'What is DCR compliance and why is it important?',
                a: 'DCR stands for Domestic Content Requirement. To qualify for Central Government solar subsidies, the solar cells and modules must be manufactured in India. Solar Rex provides fully certified DCR solar grids so you receive your subsidies guaranteed.'
            },
            {
                q: 'How long does the installation process take?',
                a: 'The mechanical and electrical installation takes just 2 to 3 days on-site. However, net-metering approvals and government inspection can take between 2 to 4 weeks depending on the local utility provider.'
            },
            {
                q: 'What maintenance is required for residential solar?',
                a: 'Residential systems require minimal maintenance. Cleaning the panels with water once every 2 weeks to remove dust is usually sufficient to maintain optimal generation output. We offer automated pressure nozzles as well.'
            },
            {
                q: 'Can I run my air conditioner on solar power?',
                a: 'Yes, solar systems can easily run air conditioners. For a standard 1.5-ton AC, a 5 kW or larger solar system is recommended to handle the starting current and continuous load.'
            },
            {
                q: 'What happens to my solar panels during heavy rain or hail?',
                a: 'Our solar panels are built with tempered, impact-resistant glass certified to withstand hail, heavy winds, and extreme monsoon rains. Rain actually helps clean dust off the panels, improving generation.'
            },
            {
                q: 'Does solar still work on cloudy or rainy days?',
                a: 'Yes, solar panels still generate electricity on cloudy or rainy days by utilizing diffused sunlight, though their efficiency will be reduced to about 10-25% of their peak capacity.'
            },
            {
                q: 'Is it possible to go completely off-grid with Solar Rex?',
                a: 'Yes, we design hybrid and off-grid systems with premium lithium battery banks (ESS) that allow you to be 100% independent of the utility grid, though a grid-tied hybrid system is generally more cost-effective.'
            },
            {
                q: 'How does the solar subsidy get credited to my account?',
                a: 'Once the net-metering is installed and inspected by the DISCOM officer, the subsidy amount is directly credited to your registered bank account via DBT (Direct Benefit Transfer) within 30 to 45 days.'
            }
        ]
    },
    'commercial-solar': {
        title: 'Commercial Solar Plants',
        subtitle: 'Scale Operations, Minimize Overhead Costs',
        tagline: 'Designed for corporate buildings, hospitals, and educational institutions with maximum ROI and tax benefits.',
        image: 'images/categories/cat_commercial.png',
        overview: 'Reduce operational costs and demonstrate your commitment to sustainability. Our commercial solar systems are designed for maximum ROI and long-term reliability. We structure commercial contracts with flexible CAPEX or OPEX models, optimizing energy output and protecting your operations against rising commercial tariff rates.',
        highlights: [
            'Drastic reduction in peak demand tariff charges',
            '40% Accelerated Depreciation tax benefits in the first year',
            'Zero Export Device integration to prevent grid backfeeding',
            'Bifacial Module technology generating power from both sides of the panel'
        ],
        specRange: '25 kW to 100 kW+',
        specModule: 'N-Type TOPCon Bifacial',
        specWatt: '580W - 680W',
        specEfficiency: '22.8% (N-Type TOPCon Bifacial)',
        specInverter: 'High-power Commercial String Inverter (Multi-MPPT)',
        specStorage: '50 kWh - 200 kWh Commercial ESS (Optional)',
        specPayback: '4 - 5 Years',
        specCompliance: 'IEEE 1547 Grid Standard Compliant',
        calcBadge: 'Commercial Solar',
        calcInstruction: 'Adjust the slider below to select your system capacity and calculate commercial setup cost, Accelerated Depreciation tax shield, and bill reduction.',
        calcNote: '*Commercial clients qualify for 40% Accelerated Depreciation tax savings in India. Financial calculations above reflect standard Year 1 tax savings of 12% of project cost.',
        calcLabel: 'Year 1 Tax Shield',
        sliderValues: [25, 40, 60, 80, 100],
        calculatorEngine: (kw) => {
            const costs = { 25: 1125000, 40: 1760000, 60: 2580000, 80: 3360000, 100: 4000000 };
            const cost = costs[kw] || (kw * 40000);
            const taxShield = Math.round(cost * 0.12); // standard first year depreciation tax shield (30% of 40%)
            const savingsMin = Math.round(kw * 1000);
            const savingsMax = Math.round(kw * 1200);
            return {
                cost: cost,
                subsidy: taxShield,
                net: cost - taxShield,
                savings: `₹${(savingsMin/1000).toFixed(0)}K - ₹${(savingsMax/1000).toFixed(0)}K`
            };
        },
        faqs: [
            {
                q: 'What is Accelerated Depreciation (AD) benefit?',
                a: 'Commercial solar assets are eligible for a 40% depreciation rate under the Income Tax Act in India. This allows businesses to write off a major portion of the asset value in the first year, reducing corporate income tax liability.'
            },
            {
                q: 'How does Net Metering work for commercial connections?',
                a: 'Net metering records surplus power generated by your solar system and exported back to the grid. The exported units are deducted from your gross consumption, slashing your monthly DISCOM bill. We handle complete utility approvals.'
            },
            {
                q: 'What happens if our building roof has shade or obstructions?',
                a: 'Our engineering team performs a full 3D lidar shading analysis. We configure string optimization or install micro-inverters so that shaded areas do not affect the output of the remaining panel segments.'
            },
            {
                q: 'Do you offer Power Purchase Agreements (PPA) / OPEX models for commercial clients?',
                a: 'Yes. For commercial projects above 100 kW, we offer OPEX/PPA models where we install and maintain the system, and you only pay for the solar energy generated at a rate 30-40% lower than your utility grid tariff.'
            },
            {
                q: 'How does solar impact our building\'s property value?',
                a: 'Installing solar increases property value by reducing operating expenses and improving the building\'s energy rating. It also counts towards green building certifications (LEED/IGBC).'
            },
            {
                q: 'What is the typical ROI period for a commercial system?',
                a: 'With commercial tariffs being higher, the typical payback period is between 3 to 4 years. When including first-year Accelerated Depreciation tax shields, the payback can be as short as 2.5 years.'
            },
            {
                q: 'How do you monitor the health of multiple commercial sites?',
                a: 'We provide a centralized Enterprise SCADA Dashboard that aggregates real-time performance, alerts, and degradation analytics across all your facility locations.'
            },
            {
                q: 'Can commercial solar systems integrate with existing diesel generators (DG)?',
                a: 'Yes, we install advanced DG-Solar PV controllers that synchronize solar generation with your diesel generators, reducing diesel consumption by up to 70% without compromising power stability.'
            }
        ]
    },
    'industrial-solar': {
        title: 'Industrial Megawatt Solutions',
        subtitle: 'High-Capacity Zero-Emission Infrastructure',
        tagline: 'Turn-key megawatt-scale rooftop and ground-mounted solar grids for manufacturing hubs, warehouses, and factories.',
        image: 'images/categories/cat_industrial.png',
        overview: 'High-capacity energy solutions for heavy industry. We provide the infrastructure needed to power large-scale operations with zero-emission technology. From structural steel reinforcement to substation integration and high-voltage grid connection, our industrial projects are engineered for extreme load conditions and long-term durability.',
        highlights: [
            'Megawatt-scale BESS container storage systems',
            'Grid-tie substation integration and high-voltage cabling',
            'SCADA system integration for automated remote asset management',
            'Achieves immediate ESG targets and carbon offset optimization'
        ],
        specRange: '250 kW to 2 MW+',
        specModule: 'N-Type TOPCon Bifacial',
        specWatt: '580W - 680W',
        specEfficiency: '23.0% (N-Type TOPCon Bifacial)',
        specInverter: 'Central Inverter / Utility Scale Container Stations',
        specStorage: 'Custom Megawatt BESS Container Solutions',
        specPayback: '4 - 5 Years',
        specCompliance: 'CEA & State Grid Code Compliant',
        calcBadge: 'Industrial Solar',
        calcInstruction: 'Adjust the slider below to select your megawatt-scale capacity and calculate estimated CAPEX, custom tax benefits, and monthly grid offset.',
        calcNote: '*Industrial installations qualify for AD tax write-offs and specific state industrial incentives. Estimates reflect standard utility rate offsets.',
        calcLabel: 'Year 1 Tax Shield',
        sliderValues: [250, 500, 750, 1000, 2000],
        calculatorEngine: (kw) => {
            const costs = { 250: 9750000, 500: 19000000, 750: 27750000, 1000: 36000000, 2000: 70000000 };
            const cost = costs[kw] || (kw * 35000);
            const taxShield = Math.round(cost * 0.12);
            const savingsMin = Math.round(kw * 1000);
            const savingsMax = Math.round(kw * 1200);
            
            // Format to lakhs or crores
            const formatShort = (val) => {
                if (val >= 10000000) {
                    return `₹${(val/10000000).toFixed(1)} Cr`;
                }
                return `₹${(val/100000).toFixed(1)} L`;
            };
            
            return {
                cost: cost,
                subsidy: taxShield,
                net: cost - taxShield,
                savings: `${formatShort(savingsMin)} - ${formatShort(savingsMax)}`,
                customFormat: true // Signal to use raw string without formatINR inside the main calc
            };
        },
        faqs: [
            {
                q: 'Do you offer power purchase agreements (PPA) / OPEX models?',
                a: 'Yes. For industrial installations, we offer both CAPEX (ownership) and OPEX (developer-owned PPA) models. Under the OPEX model, you pay zero upfront costs and simply purchase electricity at a tariff significantly cheaper than the grid rate.'
            },
            {
                q: 'How do you ensure safety on industrial metal roofs?',
                a: 'We use non-penetrative standing seam clamps for metal roofs to prevent water leakage. Our structures are certified by structural engineers to withstand wind speeds up to 180 km/h, and we integrate complete lightning protection grids.'
            },
            {
                q: 'What is the lifetime of a utility-scale industrial solar plant?',
                a: 'The solar panels are warrantied to perform for 25 years (maintaining at least 85% efficiency). The structural steel frames and cabling are engineered to exceed 30 years. Inverters generally require component servicing or swap at Year 12.'
            },
            {
                q: 'What is the policy for Open Access solar for heavy industries?',
                a: 'For industries consuming high amounts of power, we facilitate Open Access solar, allowing you to procure green power from our off-site solar parks via the grid if your rooftop space is insufficient.'
            },
            {
                q: 'Can a megawatt-scale solar plant support heavy machinery starting loads?',
                a: 'Yes. By utilizing smart grid-forming inverters and Battery Energy Storage Systems (BESS), our systems handle high-surge starting currents and reactive power requirements of heavy industrial machinery.'
            },
            {
                q: 'How do you handle grid outages in an industrial setup?',
                a: 'We install grid-interactive hybrid systems with rapid anti-islanding protection and battery storage. In the event of a grid outage, the system seamlessly transitions to microgrid mode in milliseconds to keep critical loads running.'
            },
            {
                q: 'What certifications and approvals are handled by Solar Rex?',
                a: 'We manage the entire lifecycle of approvals, including CEIG (Chief Electrical Inspector to Government) clearance, structural stability certificates, DISCOM connectivity permissions, and environmental clearances.'
            },
            {
                q: 'What warranty is provided on industrial inverters and structures?',
                a: 'We provide a standard 5-to-10 year warranty on inverters (extendable to 20 years) and a 10-year warranty on hot-dip galvanized mounting structures, alongside the standard 25-year panel performance warranty.'
            }
        ]
    },
    'maintenance-support': {
        title: 'Solar Maintenance & Support',
        subtitle: 'Protect Your Asset, Maximize Lifetime Yield',
        tagline: 'Complete diagnostic testing, panel washing, and priority inverter repair services to ensure peak output.',
        image: 'images/decorations/operations_hero.png',
        overview: 'Maximum uptime guaranteed. Our dedicated support team provides comprehensive monitoring and preventative maintenance to keep your system performing at its peak. Dust accumulation (soiling) and inverter component heating can degrade solar yield by up to 25%. Our AMC services cover systematic cleaning, thermal drone imaging, and priority SLA responses.',
        highlights: [
            '24/7 IoT remote monitoring with automated yield alert system',
            'Preventative cleaning checks to eliminate panel dust degradation',
            'Thermal imaging diagnostics to identify electrical hot-spots',
            'Priority SLA support with on-site technician deployment under 4 hours'
        ],
        specRange: 'Annual Maintenance Contract (AMC)',
        specModule: 'N-Type TOPCon Module Support',
        specWatt: '580W - 680W Panel Compatible',
        specEfficiency: 'Prevent up to 25% Dust-Induced Loss',
        specInverter: 'Routine Inverter Cleaning & Component Sweeps',
        specStorage: 'Battery Health Audits & Capacity Testing',
        specPayback: 'Extended System Uptime (30+ Years)',
        specCompliance: 'ISO 9001 Operations Certified',
        calcBadge: 'O&M AMC Services',
        calcInstruction: 'Select the scale of your solar system to calculate the annual contract pricing and the estimated generation loss value prevented by our maintenance team.',
        calcNote: '*Regular cleaning and calibration prevent dust accumulation (soiling losses) which typically decreases system yield by 15-20%. The contract pays for itself.',
        calcLabel: 'Prevented Loss Value',
        sliderValues: [10, 50, 100, 250, 500],
        calculatorEngine: (kw) => {
            const costs = { 10: 12000, 50: 35000, 100: 60000, 250: 120000, 500: 200000 };
            const cost = costs[kw] || (kw * 400);
            const preventedLoss = Math.round(kw * 1800); // estimated annual cash value of generation saved from soiling
            const savingsVal = Math.round(preventedLoss / 12);
            return {
                cost: cost,
                subsidy: preventedLoss,
                net: Math.max(0, cost - preventedLoss), // AMC net overhead is offset
                savings: `₹${savingsVal.toLocaleString('en-IN')}/Mo`
            };
        },
        faqs: [
            {
                q: 'Why does solar panel cleaning affect performance?',
                a: 'Dust, pollen, bird droppings, and industrial soot block sunlight from hitting the solar cells. This is called soiling loss. In dry climates, soiling can reduce power generation by 1.5% per week, cumulating to over 25% if left uncleaned.'
            },
            {
                q: 'What does the Annual Maintenance Contract (AMC) include?',
                a: 'Our AMC includes: Scheduled panel washing (twice a month), semi-annual electrical tests (string voltage, insulation resistance), annual thermal imaging of panels/connections, priority troubleshooting, and inverter service sweeps.'
            },
            {
                q: 'What is thermal imaging and how does it prevent failures?',
                a: 'We use infrared thermal cameras to scan panels. Defective solar cells or loose cable connectors generate heat and appear as bright "hot spots" under thermal imaging. Catching these early prevents cell degradation and fire hazards.'
            },
            {
                q: 'How often should solar panels be washed?',
                a: 'Typically, twice a month is ideal to prevent soiling losses. In dusty industrial zones or near highways, weekly cleanings may be required. We offer automated robotic dry-cleaning solutions as well.'
            },
            {
                q: 'Do you provide maintenance for systems installed by other developers?',
                a: 'Yes, we provide full diagnostic audits, performance optimization, and Annual Maintenance Contracts (AMC) for existing third-party solar installations.'
            },
            {
                q: 'What is the response time (SLA) for system faults?',
                a: 'Under our Premium AMC, we guarantee a remote diagnostic response within 2 hours and an on-site technician deployment within 4 hours for any critical system outages.'
            },
            {
                q: 'How does drone thermography identify defect zones?',
                a: 'High-resolution thermal cameras mounted on drones scan the entire array to detect hot spots, micro-cracks, and bypassed diodes that are invisible to the naked eye, preventing system degradation and fire risks.'
            },
            {
                q: 'Is inverter servicing covered in the AMC?',
                a: 'Yes, the AMC covers regular inverter air filter cleaning, thermal inspection of contactors, firmware updates, and diagnostic sweeps to prevent sudden inverter failure.'
            }
        ]
    }
};

// 2. Formatting Currency helper
const formatINR = (amount) => {
    return '₹' + amount.toLocaleString('en-IN');
};

// 3. Dynamic Page Builder
document.addEventListener('DOMContentLoaded', () => {
    // A. Parse and whitelist query parameter
    const params = new URLSearchParams(window.location.search);
    const VALID = ['residential-solar', 'commercial-solar', 'industrial-solar', 'maintenance-support'];
    const type = VALID.includes(params.get('type')) ? params.get('type') : 'residential-solar';
    
    // Find dataset
    const data = solutionData[type];
    
    // B. Inject Text Contents
    document.title = `Solar Rex | ${data.title}`;
    const breadcrumbCurrent = document.getElementById('breadcrumb-current');
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = data.title;
    
    const solTitle = document.getElementById('sol-title');
    if (solTitle) solTitle.textContent = data.title;
    
    const solSubtitle = document.getElementById('sol-subtitle');
    if (solSubtitle) solSubtitle.textContent = data.subtitle;
    
    const solTagline = document.getElementById('sol-tagline');
    if (solTagline) solTagline.textContent = data.tagline;
    
    const solOverviewText = document.getElementById('sol-overview-text');
    if (solOverviewText) solOverviewText.textContent = data.overview;
    
    // Hero image
    const solHeroImage = document.getElementById('sol-hero-image');
    if (solHeroImage) {
        solHeroImage.style.backgroundImage = `url('${data.image}')`;
        // Small zoom-in entrance
        setTimeout(() => {
            solHeroImage.style.transform = 'scale(1.0)';
        }, 100);
    }
    
    // C. Inject Key Highlights
    const solHighlights = document.getElementById('sol-highlights');
    if (solHighlights) {
        solHighlights.innerHTML = '';
        data.highlights.forEach(highlight => {
            const li = document.createElement('li');
            li.innerHTML = `<i class='bx bx-check-circle'></i> ${highlight}`;
            solHighlights.appendChild(li);
        });
    }
    
    // D. Inject Specifications
    const specRange = document.getElementById('spec-range');
    if (specRange) specRange.textContent = data.specRange;

    const specModule = document.getElementById('spec-module');
    if (specModule) specModule.textContent = data.specModule;

    const specWatt = document.getElementById('spec-watt');
    if (specWatt) specWatt.textContent = data.specWatt;
    
    const specEfficiency = document.getElementById('spec-efficiency');
    if (specEfficiency) specEfficiency.textContent = data.specEfficiency;
    
    const specInverter = document.getElementById('spec-inverter');
    if (specInverter) specInverter.textContent = data.specInverter;
    
    const specStorage = document.getElementById('spec-storage');
    if (specStorage) specStorage.textContent = data.specStorage;
    
    const specPayback = document.getElementById('spec-payback');
    if (specPayback) specPayback.textContent = data.specPayback;
    
    const specCompliance = document.getElementById('spec-compliance');
    if (specCompliance) specCompliance.textContent = data.specCompliance;

    
    // H. Inject FAQs securely with DOM API (fixes HIGH-03 innerHTML XSS)
    const solFaqContainer = document.getElementById('sol-faq-container');
    if (solFaqContainer) {
        solFaqContainer.innerHTML = '';
        data.faqs.forEach((faq, idx) => {
            const item = document.createElement('div');
            item.className = 'faq-item';
            
            const btn = document.createElement('button');
            btn.className = 'faq-question-btn';
            
            const qSpan = document.createElement('span');
            qSpan.textContent = faq.q;
            btn.appendChild(qSpan);
            
            const icon = document.createElement('i');
            icon.className = 'bx bx-chevron-down';
            btn.appendChild(icon);
            
            const answerDiv = document.createElement('div');
            answerDiv.className = 'faq-answer';
            
            const answerP = document.createElement('p');
            answerP.textContent = faq.a;
            answerDiv.appendChild(answerP);
            
            item.appendChild(btn);
            item.appendChild(answerDiv);
            
            // Accordion toggle behavior
            btn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // close all other items
                document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));
                
                if (!isActive) {
                    item.classList.add('active');
                }
            });
            
            solFaqContainer.appendChild(item);
        });
    }
    

    
    // J. Screen Reveal Transition Out on Load
    const curtain = document.getElementById('page-curtain');
    const mainContent = document.getElementById('sol-main-content');
    
    if (curtain) {
        setTimeout(() => {
            curtain.classList.remove('active');
            if (mainContent) {
                mainContent.style.opacity = '1';
            }
        }, 300);
    }
    
    // K. Back to Home click curtain exit transition
    const backBtn = document.getElementById('sol-back-nav');
    if (backBtn && curtain) {
        backBtn.addEventListener('click', (e) => {
            // Standard clicks only
            if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            e.preventDefault();
            
            // Transition back
            curtain.classList.add('active');
            
            setTimeout(() => {
                window.location.href = backBtn.getAttribute('href');
            }, 800);
        });
    }
    
    // L. Scroll Reveal Observer binding (fixes MED-05 layout jank on scroll up)
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.05,
            rootMargin: '0px 0px -50px 0px'
        });
        revealElements.forEach(el => revealObserver.observe(el));
    }
});
