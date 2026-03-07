require('dotenv').config();

module.exports = {
    schema: './prisma/schema.prisma',
    migrations: {
        seed: 'node ./prisma/seed.js'  // <-- points to your seed file
    },
    datasource: {
        url: process.env.DATABASE_URL
    }
};