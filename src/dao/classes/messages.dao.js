import messagesModel from '../models/messagesModel.js';
import user from '../models/usersModel.js'

class MessagesMongoDAO {
    async findAll() {
        try {
            return await messagesModel.find().populate('user','email').lean();
        } catch (error) {
            throw error;
        }
    }

    async create(message) {
        try {
            return await messagesModel.create(message); 
        } catch (error) {
            throw error;
        }
    }
}

export default new MessagesMongoDAO();
