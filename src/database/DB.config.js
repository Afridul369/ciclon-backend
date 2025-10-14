require('dotenv').config()
const mongoose = require('mongoose')


exports.connectDatabase = async () => {
    try {
        const db = await mongoose.connect(`${process.env.MONGODB_URL}`)
        console.log('Database connection succesfully ... ' , db.connection.host);
    } catch (error) {
        console.log('Error from connect database ', error);
    }
}