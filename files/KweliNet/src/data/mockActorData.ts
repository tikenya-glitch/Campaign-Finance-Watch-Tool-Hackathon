export const mockActors = [
    {
        id: 'gov_1',
        name: 'Hon. James Mwangi',
        role: 'Governor',
        county: 'Nairobi',
        party: 'UDA',
        termLimit: { current: 1, max: 2, yearsIn: 3, totalYears: 10 },
        fundingSources: ['Apex Infrastructure', 'Quantum Offshore'],
        riskIndicator: 'Critical', // 92/100
        riskScore: 92,
        allegations: [
            { date: '2024-06-15', description: 'EACC probe into KES 450M bypass tender awarded to Apex Infrastructure shortly after campaign injection.' },
            { date: '2023-11-05', description: 'Flagged transaction via Mauritius shell company (Quantum Offshore).' }
        ]
    },
    {
        id: 'gov_2',
        name: 'Hon. Fatuma Ali',
        role: 'Governor',
        county: 'Mombasa',
        party: 'ODM',
        termLimit: { current: 2, max: 2, yearsIn: 8, totalYears: 10 },
        fundingSources: ['Rift Valley Logistics', 'Port Authority Affiliates'],
        riskIndicator: 'High', // 78/100
        riskScore: 78,
        allegations: [
            { date: '2024-05-12', description: 'Active DCI investigation into coastal land rezoning kickbacks linked to Logistics Hub.' }
        ]
    },
    {
        id: 'sen_1',
        name: 'Sen. Peter Kipkurui',
        role: 'Senator',
        county: 'Uasin Gishu',
        party: 'UDA',
        termLimit: { current: 1, max: Infinity, yearsIn: 2, totalYears: Infinity },
        fundingSources: ['ORPP Statutory', 'Local Farmers Union'],
        riskIndicator: 'Low', // 15/100
        riskScore: 15,
        allegations: []
    },
    {
        id: 'mp_1',
        name: 'Hon. Sarah Wanjiku',
        role: 'MP',
        county: 'Kiambu',
        party: 'Jubilee',
        termLimit: { current: 3, max: Infinity, yearsIn: 12, totalYears: Infinity },
        fundingSources: ['Tech Hub Nairobi', 'Self-Funded'],
        riskIndicator: 'Medium', // 45/100
        riskScore: 45,
        allegations: [
            { date: '2024-07-02', description: 'Conflict of interest flagged in ICT committee hearings regarding Tech Hub zoning.' }
        ]
    },
    {
        id: 'gov_3',
        name: 'Hon. David Ochieng',
        role: 'Governor',
        county: 'Kisumu',
        party: 'ODM',
        termLimit: { current: 1, max: 2, yearsIn: 4, totalYears: 10 },
        fundingSources: ['Classified PAC', 'ORPP Statutory'],
        riskIndicator: 'Critical', // 88/100
        riskScore: 88,
        allegations: [
            { date: '2024-08-01', description: 'Suspicious crypto liquidation (KES 95M) injected into campaign fund via untraceable PAC.' },
            { date: '2024-01-20', description: 'Audit queries raised over missing county healthcare funds.' }
        ]
    },
    {
        id: 'wr_1',
        name: 'Hon. Amina Hassan',
        role: 'Women Rep',
        county: 'Garissa',
        party: 'Wiper',
        termLimit: { current: 2, max: Infinity, yearsIn: 7, totalYears: Infinity },
        fundingSources: ['Quantum Offshore (Unverified)'],
        riskIndicator: 'High', // 70/100
        riskScore: 70,
        allegations: [
            { date: '2024-08-10', description: 'Consulting fees flagged by FRC from Quantum Offshore, suspected money laundering.' }
        ]
    }
];
