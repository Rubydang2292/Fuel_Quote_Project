// npm install mongoose
const mongoose = require('mongoose');

// to suppress the deprecation warning
mongoose.set('strictQuery', true);

// function to connect the database
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_URI, {

        })
        console.log("DB connection successfully!");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = { connectDB }