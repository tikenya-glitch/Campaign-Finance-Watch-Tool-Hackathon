const { esClient } = require('../config/elasticSearch');

const AnalyticsService = {

    /* =====================================================
       B2C DASHBOARD ANALYTICS
       Campaign → Users
    ===================================================== */

    // Total B2C Volume + Count + Average
    getB2CTotals: async () => {
        return await esClient.search({
            index: 'transactions',
            size: 0,
            query: { term: { type: 'B2C' } },
            aggs: {
                total_volume: { sum: { field: 'amount' } },
                total_count: { value_count: { field: 'transactionId' } },
                avg_amount: { avg: { field: 'amount' } }
            }
        });
    },

    // Top Receiving Users (Potential Influence Clusters)
    getTopB2CReceivers: async () => {
        return await esClient.search({
            index: 'transactions',
            size: 0,
            query: { term: { type: 'B2C' } },
            aggs: {
                top_receivers: {
                    terms: { field: 'receiverId', size: 10 },
                    aggs: {
                        total_received: { sum: { field: 'amount' } }
                    }
                }
            }
        });
    },

    // Geographic Spread of B2C Funds
    getB2CByCounty: async () => {
        return await esClient.search({
            index: 'transactions',
            size: 0,
            query: { term: { type: 'B2C' } },
            aggs: {
                counties: {
                    terms: { field: 'county', size: 47 },
                    aggs: {
                        total_amount: { sum: { field: 'amount' } }
                    }
                }
            }
        });
    },


    /* =====================================================
       C2C DASHBOARD ANALYTICS
       User → User Transfers
    ===================================================== */

    // Overall C2C Flow
    getC2CTotals: async () => {
        return await esClient.search({
            index: 'transactions',
            size: 0,
            query: { term: { type: 'C2C' } },
            aggs: {
                total_volume: { sum: { field: 'amount' } },
                total_count: { value_count: { field: 'transactionId' } },
                avg_amount: { avg: { field: 'amount' } }
            }
        });
    },

    // High Frequency Senders (Possible Mobilization Networks)
    getC2CTransferPatterns: async () => {
        return await esClient.search({
            index: 'transactions',
            size: 0,
            query: { term: { type: 'C2C' } },
            aggs: {
                top_senders: {
                    terms: { field: 'senderId', size: 10 },
                    aggs: {
                        transfer_count: { value_count: { field: 'transactionId' } },
                        total_sent: { sum: { field: 'amount' } }
                    }
                }
            }
        });
    },

    // Micro-Transfers (Possible Vote Buying)
    getFlaggedC2CTransactions: async (threshold = 500) => {
        return await esClient.search({
            index: 'transactions',
            size: 0,
            query: {
                bool: {
                    must: [
                        { term: { type: 'C2C' } },
                        { range: { amount: { lte: threshold } } }
                    ]
                }
            },
            aggs: {
                suspicious_wards: {
                    terms: { field: 'ward', size: 20 },
                    aggs: {
                        count: { value_count: { field: 'transactionId' } }
                    }
                }
            }
        });
    },


    /* =====================================================
       WITHDRAWAL DASHBOARD ANALYTICS
       User → Vendor Outflows
    ===================================================== */

    // Withdrawal Totals
    getWithdrawalTotals: async () => {
        return await esClient.search({
            index: 'transactions',
            size: 0,
            query: { term: { type: 'WITHDRAWAL' } },
            aggs: {
                total_volume: { sum: { field: 'amount' } },
                total_count: { value_count: { field: 'transactionId' } },
                avg_amount: { avg: { field: 'amount' } }
            }
        });
    },

    // Top Vendors Receiving Funds
    getWithdrawalsByVendor: async () => {
        return await esClient.search({
            index: 'transactions',
            size: 0,
            query: { term: { type: 'WITHDRAWAL' } },
            aggs: {
                top_vendors: {
                    terms: { field: 'vendorId', size: 10 },
                    aggs: {
                        total_received: { sum: { field: 'amount' } }
                    }
                }
            }
        });
    },

    // Withdrawal Spikes (Last Hour)
    getWithdrawalSpikes: async () => {
        return await esClient.search({
            index: 'transactions',
            size: 0,
            query: {
                bool: {
                    must: [
                        { term: { type: 'WITHDRAWAL' } },
                        { range: { createdAt: { gte: "now-7d" } } }
                    ]
                }
            },
            aggs: {
                hot_zones: {
                    terms: { field: 'ward', size: 20 },
                    aggs: {
                        hourly_volume: { sum: { field: 'amount' } }
                    }
                }
            }
        });
    },

    // Add this inside AnalyticsService object in your services file
    getAlerts: async () => {
        const TOTAL_CAP = 17000000000; // 17 Billion

        const results = await esClient.search({
            index: 'transactions',
            size: 0,
            aggs: {
                // 1. Total Cumulative for the 17B alert (Stays same: tracks all money)
                grand_total: { sum: { field: 'amount' } },

                // 2. High Value Transactions (Stays same)
                high_value_txs: {
                    filter: { range: { amount: { gte: 20000 } } },
                    aggs: {
                        hits: { top_hits: { size: 10, _source: ["transactionId", "amount", "senderId", "receiverId"] } }
                    }
                },

                // 3. Percentage Analysis - UPDATED to only capture WITHDRAWAL
                users_cumulative: {
                    filter: { term: { type: 'WITHDRAWAL' } }, // <--- New Filter Layer
                    aggs: {
                        by_user: {
                            terms: { field: 'senderId', size: 50 }, // Note: Withdrawal uses senderId for the person pulling money
                            aggs: {
                                total_withdrawn: { sum: { field: 'amount' } },
                                max_single_tx: { max: { field: 'amount' } }
                            }
                        }
                    }
                }
            }
        });

        return results.aggregations;
    },

    // Add these inside your AnalyticsService object
    getTransactionTimeSeries: async (type = null) => {
        const query = type ? { term: { type: type.toUpperCase() } } : { match_all: {} };
        return await esClient.search({
            index: 'transactions',
            size: 0,
            query,
            aggs: {
                transactions_over_time: {
                    date_histogram: {
                        field: "createdAt",
                        fixed_interval: "1h" // 'hour' is now 'fixed_interval' in newer ES versions
                    },
                    aggs: {
                        total_amount: { sum: { field: "amount" } },
                        transaction_count: { value_count: { field: "transactionId" } }
                    }
                }
            }
        });
    },

    getTransactionNetwork: async (type = null) => {
        const query = type ? { term: { type: type.toUpperCase() } } : { match_all: {} };
        return await esClient.search({
            index: "transactions",
            size: 0,
            query,
            aggs: {
                senders: {
                    terms: { field: "senderId", size: 20 },
                    aggs: {
                        receivers: {
                            terms: { field: "receiverId", size: 10 },
                            aggs: {
                                total_amount: { sum: { field: "amount" } }
                            }
                        }
                    }
                }
            }
        });
    },

    getTransactionAnomalies: async () => {
        return await esClient.search({
            index: "transactions",
            size: 0,
            aggs: {
                amount_stats: { extended_stats: { field: "amount" } },
                high_value_alerts: {
                    filter: { range: { amount: { gte: 20000 } } },
                    aggs: {
                        hits: {
                            top_hits: {
                                size: 10,
                                _source: ["transactionId", "amount", "senderId", "receiverId", "type", "createdAt"]
                            }
                        }
                    }
                }
            }
        });
    }
};

module.exports = AnalyticsService;