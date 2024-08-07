import mongoose from 'mongoose';

const cartsCollection = 'Carts';

const cartSchema = new mongoose.Schema({
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Products' },
        quantity: { type: Number, required: true }
    }]
});

const cartsModel = mongoose.model(cartsCollection, cartSchema);

export default cartsModel;
