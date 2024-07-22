require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 4001,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
};
