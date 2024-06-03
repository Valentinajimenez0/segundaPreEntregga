
import mongoose from "mongoose";

const messageCollection = "mensajes"

const messageSchema = new mongoose.Schema({
    user: {type: String},
    message: {type: String }
});

const messageModel = mongoose.model(messageCollection, messageSchema)

export default messageModel