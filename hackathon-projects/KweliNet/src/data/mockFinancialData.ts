export interface FinancialTransaction {
    id: string;
    party: string;
    donor: string;
    donorType: string;
    donationType: 'MONETARY' | 'IN-KIND';
    date: string;
    amount: number;
}

// Helper to generate random dates between 2013 and 2026
const randomDate = (start: Date, end: Date) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];
};

const parties = [
    'UDA (United Democratic Alliance)',
    'ODM (Orange Democratic Movement)',
    'Jubilee Party',
    'Wiper Democratic Movement',
    'ANC (Amani National Congress)',
    'FORD-Kenya',
    'KANU',
    'DAP-K',
    'PAA (Pamoja African Alliance)',
    'MCCP (Maendeleo Chap Chap)',
    'Safina Party',
    'NARC-Kenya'
];

const donorTypes = ['State Funding', 'Private company', 'Individual', 'Investment holding company', 'Trust', 'Unknown'];
const donationTypes: ('MONETARY' | 'IN-KIND')[] = ['MONETARY', 'MONETARY', 'MONETARY', 'IN-KIND'];

const privateDonors = [
    { name: 'Rift Valley Logistics', type: 'Private company' },
    { name: 'Nairobi Tech Hub', type: 'Private company' },
    { name: 'Infracon Holdings Ltd.', type: 'Investment holding company' },
    { name: 'Mount Kenya Trust', type: 'Trust' },
    { name: 'Ms. Sarah Wanjiku', type: 'Individual' },
    { name: 'Mr. David Ochieng', type: 'Individual' },
    { name: 'AgriCorp Kenya', type: 'Private company' },
    { name: 'Savannah Cement', type: 'Private company' },
    { name: 'WE ARE THE PEOPLE', type: 'Unknown' },
    { name: 'Fynbos Equity (KE) Ltd', type: 'Private company' },
];

export const generateMockTransactions = (count: number): FinancialTransaction[] => {
    const txs: FinancialTransaction[] = [];

    // Generate base ORPP funding (State Funding) which is massive
    for (let i = 0; i < parties.length; i++) {
        // distribute ORPP across 2013-2026 periodically
        for (let year = 2013; year <= 2026; year++) {
            // Only top 5 parties get majority ORPP
            if (i < 5 && Math.random() > 0.2) {
                txs.push({
                    id: `orpp-${year}-${i}`,
                    party: parties[i],
                    donor: 'ORPP Public Fund',
                    donorType: 'State Funding',
                    donationType: 'MONETARY',
                    date: `${year}-06-30`,
                    amount: Math.floor(Math.random() * 500000000) + 100000000 // 100M - 600M KES
                });
            }
        }
    }

    // Generate random private donations
    for (let i = 0; i < count; i++) {
        const donor = privateDonors[Math.floor(Math.random() * privateDonors.length)];
        txs.push({
            id: `priv-${i}`,
            party: parties[Math.floor(Math.random() * parties.length)],
            donor: donor.name,
            donorType: donor.type,
            donationType: donationTypes[Math.floor(Math.random() * donationTypes.length)],
            date: randomDate(new Date(2013, 0, 1), new Date(2026, 11, 31)),
            amount: Math.floor(Math.random() * 50000000) + 1000000 // 1M - 51M KES
        });
    }

    return txs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Generate 500 private donations
export const mockTransactions = generateMockTransactions(500);

export const getAggregatedData = (transactions: FinancialTransaction[]) => {
    // Basic aggregation utilities for charting
    const totalByParty = transactions.reduce((acc, tx) => {
        acc[tx.party] = (acc[tx.party] || 0) + tx.amount;
        return acc;
    }, {} as Record<string, number>);

    return { totalByParty };
};
