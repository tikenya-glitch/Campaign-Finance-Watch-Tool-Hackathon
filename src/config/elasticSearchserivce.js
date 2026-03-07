const { esClient } = require('./elasticSearch');
const { prisma } = require('../../prisma/prisma.config');


async function indexTransaction(transactionId) {

    const transaction = await prisma.transaction.findUnique({
        where: { id: transactionId }
    });

    if (!transaction || transaction.status !== "SUCCESS") return;

    await esClient.index({
        index: 'transactions',
        id: transaction.id,
        document: {
            transactionId: transaction.id,
            type: transaction.type,
            amount: parseFloat(transaction.amount),
            status: transaction.status,
            county: transaction.county,
            ward: transaction.ward,
            senderId: transaction.senderId,
            receiverId: transaction.receiverId,
            vendorId: transaction.vendorId,
            createdAt: transaction.createdAt
        }
    });
}

module.exports = { indexTransaction };