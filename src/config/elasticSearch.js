const { Client } = require('@elastic/elasticsearch');

const esClient = new Client({
    node: process.env.ELASTIC_NODE,
    auth: {
        apiKey: process.env.ELASTIC_API_KEY
    }
});

async function createIndex() {
    const exists = await esClient.indices.exists({
        index: 'transactions'
    });

    if (!exists) {
        await esClient.indices.create({
            index: 'transactions',
            mappings: {
                properties: {
                    transactionId: { type: "keyword" },
                    type: { type: "keyword" },
                    amount: { type: "double" },
                    status: { type: "keyword" },
                    county: { type: "keyword" },
                    ward: { type: "keyword" },
                    senderId: { type: "keyword" },
                    receiverId: { type: "keyword" },
                    vendorId: { type: "keyword" },
                    createdAt: { type: "date" }
                }
            }
        });

        console.log("✅ Elasticsearch index created");
    }
}

module.exports = { esClient, createIndex };