const createDoubleEntry = async (tx, { transactionId, debitAccountId, creditAccountId, amount }) => {
    // 1. Create Debit Entry (Money leaving an account)
    await tx.ledgerEntry.create({
        data: { transactionId, accountId: debitAccountId, debit: amount }
    });

    // 2. Create Credit Entry (Money entering an account)
    await tx.ledgerEntry.create({
        data: { transactionId, accountId: creditAccountId, credit: amount }
    });

    // 3. Update Balances
    await tx.account.update({
        where: { id: debitAccountId },
        data: { balance: { decrement: amount } }
    });

    await tx.account.update({
        where: { id: creditAccountId },
        data: { balance: { increment: amount } }
    });
};

module.exports = {
    createDoubleEntry
};