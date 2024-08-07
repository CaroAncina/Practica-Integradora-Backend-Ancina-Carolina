import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config()
logger.info(`Mongo URL: ${process.env.MONGODB}`);

mongoose.connect(process.env.MONGODB);

const db = mongoose.connection;

db.on('error', (error) => {
    logger.error('Connection error:', error); 
});
db.once('open', () => {
    logger.info('Connected to MongoDB'); 
});


export default {
    port: process.env.PORT || 8080,
    mongoURI: process.env.MONGODB,
    sessionSecret: process.env.SESSION_SECRET || 'secretkey'
};