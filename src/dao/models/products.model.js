import mongoose from 'mongoose';

const productsCollection = "Productos";

const productsSchema = new mongoose.Schema({
    title: { type: String, required: true, max: 100 },
    description: { type: String, required: true, max: 100 },
    price: { type: Number, required: true },
    code: { type: String, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    thumbnail: { type: String }
});

const productsModel = mongoose.model(productsCollection, productsSchema);

export default productsModel;
