import mongoose from "mongoose";

const productsCollection = "Productos";

const productsSchema = new mongoose.Schema({
    title: { type: String, required: true, max: 100 },
    description: { type: String, max: 100 }, 
    price: { type: Number, required: true },
    thumbnail: { type: String },
    code: { type: String, required: true },
    status: { type: Boolean, required: true, default: true }, 
    stock: { type: Number, required: true },
});

const productsModel = mongoose.model(productsCollection, productsSchema);

export default productsModel;

