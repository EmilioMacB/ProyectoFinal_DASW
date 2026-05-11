const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const routineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    days: [{
        day: { type: String, required: true },
        exercises: [{
            name: { type: String, required: true },
            reps: { type: String, required: true },
            img: { type: String, default: "" },
            video: { type: String, default: "" },
        }],
    }],
    createdAt: { type: Date, default: Date.now },
}, { _id: true });

const userSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true },
    Email: {
        type: String,
        required: true,
        unique: true },
    Password: {
        type: String,
        required: true },
    Routines: [{
        type: routineSchema,
        default: [],
    }],
});


// Encriptar contraseña antes de guardar
userSchema.pre("save", async function (next) {
    if (!this.isModified("Password")) return next();
    this.Password = await bcrypt.hash(this.Password, 12);
    next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
