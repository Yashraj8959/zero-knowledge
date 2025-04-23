import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
},{
    timestamps: true,
}
)

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
}

userSchema.statics.generateHashPassword = async function (password) {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    return hashPassword;
}

userSchema.statics.comparePassword = async function (password, hashPassword) {
    const isMatch = await bcrypt.compare(password, hashPassword);
    return isMatch;
}

const User = mongoose.model("User", userSchema);
export default User;
