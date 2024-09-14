import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsCollection = "Products";

const productsSchema = new mongoose.Schema({
  title: { type: String, required: true, max: 100 },
  description: { type: String, required: true, max: 500 },
  price: { type: Number, required: true, min: 1 },
  code: { type: String, required: true, max: 20, unique: true },
  stock: { type: Number, required: true, min: 1 },
  category: { type: String, required: true, max: 30 },
  thumbnail: { type: String },
  status: { type: Boolean, required: true, default: true },
  owner: { type: String, default: "admin" },
});

productsSchema.plugin(mongoosePaginate);
const productsModel = mongoose.model(productsCollection, productsSchema);

export default productsModel;
