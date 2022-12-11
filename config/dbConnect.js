const { default: mongoose } = require('mongoose')

const dbConnect = () => {
    mongoose.set('strictQuery', true);
    try {
        const conn = mongoose.connect(process.env.MONGODB_URL)
        console.log("DB OK")
    } catch(error) {
        console.log('DB error')
    }
};

module.exports = dbConnect;