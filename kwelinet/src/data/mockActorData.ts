export const mockActors = [
    {
        id: 'gov_1',
        name: 'Hon. James Mwangi',
        role: 'Governor',
        county: 'Nairobi',
        party: 'UDA',
        termLimit: { current: 1, max: 2, yearsIn: 3, totalYears: 10 },
        fundingSources: ['Party Sponsored', 'Corporate Backed'],
        riskIndicator: 'Yellow', // Under Review
        allegations: [
            { date: '2024-02-10', description: 'EACC probe into biased irregular tender awards.' },
            { date: '2023-11-05', description: 'Alleged use of county vehicles for UDA party primaries.' }
        ]
    },
    {
        id: 'gov_2',
        name: 'Hon. Fatuma Ali',
        role: 'Governor',
        county: 'Mombasa',
        party: 'ODM',
        termLimit: { current: 2, max: 2, yearsIn: 8, totalYears: 10 }, // Final term
        fundingSources: ['Self-Funded', 'Corporate Backed'],
        riskIndicator: 'Red', // Active Allegations
        allegations: [
            { date: '2024-05-12', description: 'Active DCI investigation into coastal land rezoning kickbacks.' }
        ]
    },
    {
        id: 'sen_1',
        name: 'Sen. Peter Kipkurui',
        role: 'Senator',
        county: 'Uasin Gishu',
        party: 'UDA',
        termLimit: { current: 1, max: Infinity, yearsIn: 2, totalYears: Infinity },
        fundingSources: ['Party Sponsored'],
        riskIndicator: 'Green', // Clear
        allegations: []
    },
    {
        id: 'mp_1',
        name: 'Hon. Sarah Wanjiku',
        role: 'MP',
        county: 'Kiambu',
        party: 'Jubilee',
        termLimit: { current: 3, max: Infinity, yearsIn: 12, totalYears: Infinity },
        fundingSources: ['Self-Funded'],
        riskIndicator: 'Green',
        allegations: []
    },
    {
        id: 'gov_3',
        name: 'Hon. David Ochieng',
        role: 'Governor',
        county: 'Kisumu',
        party: 'ODM',
        termLimit: { current: 1, max: 2, yearsIn: 4, totalYears: 10 },
        fundingSources: ['Corporate Backed', 'Party Sponsored'],
        riskIndicator: 'Yellow',
        allegations: [
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
        fundingSources: ['Party Sponsored'],
        riskIndicator: 'Green',
        allegations: []
    }
];
