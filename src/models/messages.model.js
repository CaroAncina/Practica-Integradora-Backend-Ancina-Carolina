import mongoose from "mongoose";

const messagesCollection = "Mensajes"

const messagesSchema = new mongoose.Schema({
    user: { type: String },
    message: { type: String },
})

const messagesModel = mongoose.model(messagesCollection, messagesSchema)

export default messagesModel