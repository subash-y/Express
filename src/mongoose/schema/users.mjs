import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
    user_name: {
        type: String,   // use String instead of mongoose.Schema.Types.String
        required: true,
        unique: true
    },
    password: {
        type: String,  
        required: true
    }
});

export const User = mongoose.model("User", usersSchema);
