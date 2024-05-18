import mongoose from "mongoose";

const messagesCollection = "Mensajes"

const messagesSchema = new mongoose.Schema({
    user: { type: String, required: true },
    message: { type: String, required: true }
})

const messagesModel = mongoose.model(messagesCollection, messagesSchema)

export default messagesModel