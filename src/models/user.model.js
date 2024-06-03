
import mongoose from "mongoose";

const userCollection = "usuarios"

const userSchema = new mongoose.Schema({
    user_name: { type: String,required: true,max: 15},
    email: { type: String, required: true, max: 50}
})

const userModel = mongoose.model(userCollection, userSchema)

export default userModel