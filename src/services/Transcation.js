const { createDoubleEntry } = require("./ledgerService");
const { prisma } = require("../../prisma/prisma.config");
/**
 * C2C Transaction
 * User → User
 */
async function processC2C({ senderId, receiverId, amount, mpesaRef }) {
    return await prisma.$transaction(async (tx) => {

        const transaction = await tx.transaction.create({
            data: {
                type: "C2C",
                amount,
                senderId,
                receiverId,
                mpesaReference: mpesaRef,
                status: "SUCCESS"
            }
        });

        const debitAcc = await tx.account.findFirst({
            where: { userId: senderId }
        });

        const creditAcc = await tx.account.findFirst({
            where: { userId: receiverId }
        });

        if (!debitAcc || !creditAcc) {
            throw new Error("Account not found");
        }

        await createDoubleEntry(tx, {
            transactionId: transaction.id,
            debitAccountId: debitAcc.id,
            creditAccountId: creditAcc.id,
            amount
        });

        return transaction;
    });
}

/**
 * B2C Transaction
 * Campaign Main Account → User
 */
async function processB2C({ vendorId, receiverId, amount, mpesaRef }) {
    return await prisma.$transaction(async (tx) => {

        const transaction = await tx.transaction.create({
            data: {
                type: "B2C",
                amount,
                receiverId,
                vendorId,
                mpesaReference: mpesaRef,
                status: "SUCCESS"
            }
        });

        const debitAcc = await tx.account.findFirst({
            where: { vendorId: vendorId }
        });

        const creditAcc = await tx.account.findFirst({
            where: { userId: receiverId }
        });

        if (!debitAcc || !creditAcc) {
            throw new Error("Account not found");
        }

        await createDoubleEntry(tx, {
            transactionId: transaction.id,
            debitAccountId: debitAcc.id,
            creditAccountId: creditAcc.id,
            amount
        });

        return transaction;
    });
}

/**
 * Withdrawal Transaction
 * User → Vendor (e.g., M-Pesa, Bank)
 */
async function processWithdrawal({ senderId, vendorId, amount, mpesaRef }) {
    return await prisma.$transaction(async (tx) => {

        const transaction = await tx.transaction.create({
            data: {
                type: "WITHDRAWAL",
                amount,
                senderId,
                vendorId,
                mpesaReference: mpesaRef,
                status: "SUCCESS"
            }
        });

        const debitAcc = await tx.account.findFirst({
            where: { userId: senderId }
        });

        const creditAcc = await tx.account.findFirst({
            where: { vendorId: vendorId }
        });

        if (!debitAcc || !creditAcc) {
            throw new Error("Account not found");
        }

        await createDoubleEntry(tx, {
            transactionId: transaction.id,
            debitAccountId: debitAcc.id,
            creditAccountId: creditAcc.id,
            amount
        });

        return transaction;
    });
}

module.exports = {
    processC2C,
    processB2C,
    processWithdrawal
};