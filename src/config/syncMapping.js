const { esClient } = require('./elasticSearch');
const { prisma } = require('../../prisma/prisma.config');
const { createIndex } = require('./elasticSearch');

const SyncService = {
    async fullSync() {
        console.log("🔄 Starting Fresh Sync: Postgres -> Elasticsearch...");

        try {
            // 1. LAYMAN: Delete the old "Search Index" so we don't have ghost data
            await esClient.indices.delete({
                index: 'transactions',
                ignore_unavailable: true
            });
            console.log("🗑️ Old index cleared.");

            // 2. Create the new index with proper mapping
            await createIndex();
            console.log("📐 New index created with mapping.");

            // 3. Pull the current "Truth" from Postgres
            const transactions = await prisma.transaction.findMany();

            if (transactions.length === 0) {
                console.log("⚠️ No transactions in database to sync.");
                return;
            }

            // 4. Prepare the data for Elasticsearch
            const body = transactions.flatMap(tx => [
                { index: { _index: 'transactions', _id: tx.id } },
                {
                    transactionId: tx.id,
                    type: tx.type,
                    amount: parseFloat(tx.amount), // Matches your KES 1,643,167.3 scale
                    status: tx.status,
                    county: tx.county,
                    ward: tx.ward,
                    senderId: tx.senderId,
                    receiverId: tx.receiverId,
                    vendorId: tx.vendorId,
                    createdAt: tx.createdAt
                }
            ]);

            // 5. Bulk push to Elastic
            const response = await esClient.bulk({
                refresh: true,
                body
            });

            if (response.errors) {
                console.error("❌ Sync had partial errors.");
            } else {
                console.log(`✅ Synced ${transactions.length} transactions.`);
            }
        } catch (err) {
            console.error("❌ Sync Service Error:", err.message);
        }
    }
};

module.exports = { SyncService };