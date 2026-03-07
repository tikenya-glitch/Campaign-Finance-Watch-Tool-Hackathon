require('dotenv').config();
const { prisma } = require('./prisma.config');

async function main() {
    console.log("🚀 Seeding Advanced Campaign Finance Dataset...");

    // 1. Cleanup existing data (ORDER MATTERS)
    await prisma.ledgerEntry.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();
    await prisma.vendor.deleteMany();

    const counties = ["Nairobi", "Kiambu", "Mombasa", "Kisumu", "Nakuru"];
    const wards = ["CBD", "Westlands", "Embakasi", "Kilimani", "Central"];

    // 2. Create Vendors
    const vendors = [];
    for (let i = 0; i < 10; i++) {
        const vendor = await prisma.vendor.create({
            data: {
                businessName: `Vendor ${i + 1}`,
                tillNumber: `TILL-${1000 + i}`,
                county: counties[i % counties.length],
                ward: wards[i % wards.length],
                account: { create: { balance: 5000000 } }
            },
            include: { account: true }
        });
        vendors.push(vendor);
    }

    // 3. Create Users
    const users = [];
    for (let i = 0; i < 100; i++) {
        const user = await prisma.user.create({
            data: {
                phoneNumber: `2547${Math.floor(10000000 + Math.random() * 90000000)}`,
                nationalId: `ID-${i + 1}`,
                county: counties[i % counties.length],
                ward: wards[i % wards.length],
                account: { create: { balance: 50000 } }
            },
            include: { account: true }
        });
        users.push(user);
    }

    /* =============================================
       PATTERN 1: THE "VOTER RING" (Convergence)
       One receiver getting exactly 500 KES from 20 different people
    ============================================= */
    console.log("🕸️ Seeding a Voter Ring pattern...");
    const mobilizer = users[0];
    for (let i = 1; i <= 20; i++) {
        await createTx("C2C", 500, users[i], mobilizer, null);
    }

    /* =============================================
       PATTERN 2: THE "MIDNIGHT SPIKE" (Velocity)
       30 withdrawals in 5 minutes at 2 AM
    ============================================= */
    console.log("🕒 Seeding a Midnight Spike...");
    const suspiciousTime = new Date();
    suspiciousTime.setHours(2, 15, 0, 0);
    for (let i = 0; i < 30; i++) {
        await createTx("WITHDRAWAL", 1500, users[i + 20], null, vendors[0], suspiciousTime);
    }

    /* =============================================
       PATTERN 3: THE "HIGH VALUE ANOMALY" (20% Rule)
       A user with 10k balance suddenly receives 200k
    ============================================= */
    console.log("💰 Seeding High Value anomalies...");
    await createTx("B2C", 250000, null, users[50], vendors[1]);

    // 4. Fill with 400 random transactions to create "background noise"
    console.log("📝 Adding background noise...");
    for (let i = 0; i < 400; i++) {
        const types = ["B2C", "C2C", "WITHDRAWAL"];
        const type = types[i % 3];
        const amount = Math.floor(Math.random() * 8000 + 200);
        await createTx(type, amount, users[Math.floor(Math.random() * 100)], users[Math.floor(Math.random() * 100)], vendors[Math.floor(Math.random() * 10)]);
    }

    console.log("✅ Advanced Seed complete.");
}

// Helper to handle the complex ledger creation
async function createTx(type, amount, sender, receiver, vendor, customDate = null) {
    const date = customDate || new Date();

    let senderId = sender?.id || null;
    let receiverId = receiver?.id || null;
    let vendorId = vendor?.id || null;
    let debitAcc = type === "B2C" ? vendor.account.id : sender.account.id;
    let creditAcc = type === "WITHDRAWAL" ? vendor.account.id : receiver.account.id;

    await prisma.transaction.create({
        data: {
            type, amount, status: "SUCCESS",
            mpesaReference: `REF-${Math.random().toString(36).substring(7)}`,
            senderId, receiverId, vendorId,
            county: sender?.county || vendor?.county,
            ward: sender?.ward || vendor?.ward,
            createdAt: date,
            ledgerEntries: {
                create: [
                    { accountId: debitAcc, debit: amount, credit: 0, createdAt: date },
                    { accountId: creditAcc, debit: 0, credit: amount, createdAt: date }
                ]
            }
        }
    });
}

main().catch(console.error).finally(() => prisma.$disconnect());