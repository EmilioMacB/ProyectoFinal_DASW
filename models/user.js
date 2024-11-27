const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
    Routine: {
        type: Object, // Rutina personalizada (puede ser más detallado)
        default: null,
    },
});


// Encriptar contraseña antes de guardar
userSchema.pre("save", async function (next) {
    if (!this.isModified("Password")) return next();
    this.Password = await bcrypt.hash(this.Password, 10);
    next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
