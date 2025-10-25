require('dotenv').config()
const mongoose = require('mongoose')

let dbUrl = process.env.MONGO_CONNECTION_URL;
(async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const conn = mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
            if (conn) {
                console.log('Database connection established...');
                resolve(true);
            }
        } catch (error) {
            console.log('Database connection failed...');
            reject(error);
        }
    })
})();