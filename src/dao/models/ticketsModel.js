import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    purchase_datetime: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true
    },
    products: [{
        title: String,
        quantity: Number,
        price: Number
    }]
});

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;
