require('dotenv').config();
const express = require('express');

const { v4: uuidv4 } = require('uuid');
const {
    processC2C,
    processB2C,
    processWithdrawal
} = require('./src/services/Transcation'); // make sure filename matches

const { indexTransaction } = require('./src/config/elasticSearchserivce');
const { prisma } = require('./prisma/prisma.config'); // ⚠️ FIX: prisma should not come from elastic service
const { createIndex } = require('./src/config/elasticSearch');
const { SyncService } = require('./src/config/syncMapping');

const Analytics = require('./src/services/elasticService');

const app = express();
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.json());

/* ============================================
   TRANSACTION ROUTES (Separated)
============================================ */

/**
 * C2C - User to User
 */
app.post('/tx/c2c', async (req, res) => {
    try {
        const txRecord = await processC2C(req.body);
        await indexTransaction(txRecord.id);

        res.json({ success: true, data: txRecord });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

/**
 * B2C - Campaign to User
 */
app.post('/tx/b2c', async (req, res) => {
    try {
        const txRecord = await processB2C(req.body);
        await indexTransaction(txRecord.id);

        res.json({ success: true, data: txRecord });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

/**
 * Withdrawal - User to Vendor
 */
app.post('/tx/withdrawal', async (req, res) => {
    try {
        const txRecord = await processWithdrawal(req.body);
        await indexTransaction(txRecord.id);

        res.json({ success: true, data: txRecord });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});


/* ============================================
   DASHBOARD
============================================ */

app.get('/dashboard/b2c', async (req, res) => {
    try {
        const [totalsRaw, topReceiversRaw, regionStatsRaw] = await Promise.all([
            Analytics.getB2CTotals(),
            Analytics.getTopB2CReceivers(),
            Analytics.getB2CByCounty()
        ]);

        const totals = {
            volume: totalsRaw.aggregations?.total_volume?.value || 0,
            count: totalsRaw.aggregations?.total_count?.value || 0
        };

        const topReceivers = (topReceiversRaw.aggregations?.top_receivers?.buckets || []).map(b => ({
            id: b.key,
            total_received: b.total_received?.value || 0
        }));

        const regionStats = (regionStatsRaw.aggregations?.counties?.buckets || []).map(b => ({
            county: b.key,
            amount: b.total_amount?.value || 0
        }));

        res.render('dashboard_b2c', { totals, topReceivers, regionStats, title: "B2C Overview" });
    } catch (err) { res.status(500).send(err.message); }
});

app.get('/dashboard/c2c', async (req, res) => {
    try {
        const [totalsRaw, patternsRaw, flaggedRaw] = await Promise.all([
            Analytics.getC2CTotals(),
            Analytics.getC2CTransferPatterns(),
            Analytics.getFlaggedC2CTransactions()
        ]);

        const totals = {
            volume: totalsRaw.aggregations?.total_volume?.value || 0,
            count: totalsRaw.aggregations?.total_count?.value || 0
        };

        // FIX: Map Top Senders for the Pattern Chart
        const patterns = (patternsRaw.aggregations?.top_senders?.buckets || []).map(b => ({
            sender: b.key,
            count: b.transfer_count?.value || 0,
            totalSent: b.total_sent?.value || 0
        }));

        // FIX: Map Suspicious Activity (Showing Wards as "hotspots" or the raw IDs)
        const flagged = (flaggedRaw.aggregations?.suspicious_wards?.buckets || []).map(b => ({
            sender: "Ward: " + b.key, // Since we aggregated by ward
            receiver: "Multiple Users",
            amount: b.count?.value + " txs" // Showing count instead of amount
        }));

        res.render('dashboard_c2c', {
            totals,
            patterns, // Now being passed
            flagged,
            title: "C2C Analytics"
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get('/dashboard/withdrawal', async (req, res) => {
    try {
        const [totalsRaw, vendorStatsRaw, spikesRaw] = await Promise.all([
            Analytics.getWithdrawalTotals(),
            Analytics.getWithdrawalsByVendor(),
            Analytics.getWithdrawalSpikes()
        ]);

        // 1. Flatten Totals (Avoid [object Object] in UI)
        const totals = {
            volume: totalsRaw.aggregations?.total_volume?.value || 0,
            count: totalsRaw.aggregations?.total_count?.value || 0,
            avg: totalsRaw.aggregations?.avg_amount?.value || 0
        };

        // 2. Map Vendor Stats (Matches your EJS loop)
        const vendorStats = (vendorStatsRaw.aggregations?.top_vendors?.buckets || []).map(bucket => ({
            key: bucket.key, // This is the vendorId
            total_volume: bucket.total_received?.value || 0 // Matches Analytics.js field name
        }));

        // 3. Map Spikes (For the bar chart)


        const spikes = (spikesRaw.aggregations?.hot_zones?.buckets || []).map(bucket => ({
            ward: bucket.key,
            intensity: (bucket.hourly_volume?.value / (totals.volume || 1)) * 100, // Calculate % for height
            amount: bucket.hourly_volume?.value || 0
        }));

        res.render('dashboard_withdrawal', {
            totals,
            vendorStats,
            spikes,
            title: "Withdrawal & Vendor Activity"
        });
    } catch (err) {
        res.status(500).send("Error loading Withdrawal dashboard: " + err.message);
    }
});

/* ============================================
    PAYMENT
 ============================================ */
/**
* GET /payment - The Ledger Gateway UI
* Fetches users and vendors to populate the dropdowns
*/
app.get('/payment', async (req, res) => {
    try {
        // Fetch users and vendors from Prisma
        const [users, vendors] = await Promise.all([
            prisma.user.findMany({
                orderBy: { id: 'asc' }
            }),
            prisma.vendor.findMany({
                orderBy: { businessName: 'asc' }
            })
        ]);

        res.render('payment', {
            users,
            vendors,
            title: "Internal Ledger Gateway"
        });
    } catch (err) {
        console.error("Gateway Load Error:", err);
        res.status(500).send("Critical System Error: Could not fetch ledger entities.");
    }
});
/* ============================================
   ALERTS AND BALANCE ROUTES (Separated)
============================================ */
app.get('/dashboard/alerts', async (req, res) => {
    try {
        const aggs = await Analytics.getAlerts();
        const TOTAL_CAP = 17000000000;

        // 1. Process 17B Cap (Handle potential nulls)
        const totalVolume = aggs.grand_total?.value || 0;
        const capReached = Math.min((totalVolume / TOTAL_CAP) * 100, 100);

        // 2. Process 20k Alerts - FIX: Path must reach the hits array
        // We use || [] to ensure .map() never fails
        const rawHits = aggs.high_value_txs?.hits?.hits?.hits || [];
        const highValueAlerts = rawHits.map(h => h._source);

        // 3. Process 20% Cumulative Rule
        const buckets = aggs.users_cumulative?.by_user?.buckets || [];
        const percentageAlerts = buckets
            .filter(b => b.total_withdrawn?.value > 0 && (b.max_single_tx?.value / b.total_received?.value) >= 0.20)
            .map(b => ({
                userId: b.key,
                total: b.total_received?.value || 0,
                maxTx: b.max_single_tx.value,
                percent: ((b.max_single_tx.value / b.total_received.value) * 100).toFixed(1)
            }));

        res.render('dashboard_alerts', {
            totalVolume,
            capReached,
            highValueAlerts, // This is now safely an array
            percentageAlerts,
            title: "Campaign Finance Red Flags"
        });
    } catch (err) {
        console.error("Alert Route Error:", err);
        res.status(500).send("Alert System Error: " + err.message);
    }
});

app.get('/dashboard/ledger', async (req, res) => {
    try {
        const ledgerEntries = await prisma.ledgerEntry.findMany({
            include: {
                account: {
                    include: { user: true, vendor: true }
                },
                transaction: true
            },
            orderBy: { createdAt: 'desc' }
        });

        // LAYMAN: We are summing up all money "Out" (Debits) and "In" (Credits)
        // to make sure no money vanished into thin air.
        const trialBalance = ledgerEntries.reduce((acc, entry) => {
            acc.totalDebits += Number(entry.debit || 0);
            acc.totalCredits += Number(entry.credit || 0);
            return acc;
        }, { totalDebits: 0, totalCredits: 0 });

        res.render('dashboard_ledger', {
            ledgerEntries,
            trialBalance,
            isBalanced: Math.abs(trialBalance.totalDebits - trialBalance.totalCredits) < 0.01,
            title: "General Ledger & Audit Trail"
        });

    } catch (err) {
        console.error("Ledger Error:", err);
        res.status(500).send("Error loading Ledger.");
    }
});

app.get('/dashboard/intelligence', async (req, res) => {
    try {
        const type = req.query.type || null;

        const [timeData, networkData, anomalyData] = await Promise.all([
            Analytics.getTransactionTimeSeries(type),
            Analytics.getTransactionNetwork(type),
            Analytics.getTransactionAnomalies()
        ]);

        // Format Time Series for Chart.js
        const chartLabels = timeData.aggregations.transactions_over_time.buckets.map(b => b.key_as_string);
        const chartValues = timeData.aggregations.transactions_over_time.buckets.map(b => b.total_amount.value);

        // Format Network for a simple table (or graph library)
        const network = timeData.aggregations.transactions_over_time.buckets.length > 0 ?
            networkData.aggregations.senders.buckets : [];

        // Stats for Anomaly Detection
        const stats = anomalyData.aggregations.amount_stats;
        const anomalies = anomalyData.aggregations.high_value_alerts.hits.hits.hits.map(h => h._source);

        res.render('dashboard_intelligence', {
            chartLabels: JSON.stringify(chartLabels),
            chartValues: JSON.stringify(chartValues),
            network,
            stats,
            anomalies,
            currentType: type,
            title: "Campaign Intelligence"
        });
    } catch (err) {
        res.status(500).send("Intelligence Error: " + err.message);
    }
});



/*=============================================
   BOOTSTRAP
============================================ */

async function bootstrap() {
    await createIndex();
    await SyncService.fullSync();
}

bootstrap()
    .then(() => {
        app.listen(3000, () => {
            console.log("MPESA Ledger Service running on port 3000");
        });
    })
    .catch(err => {
        console.error("Failed to start server:", err.message);
    });