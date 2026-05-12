const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const routineSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, maxlength: 100 },
    days: [{
        day: { type: String, required: true, trim: true },
        exercises: [{
            name: { type: String, required: true, trim: true },
            reps: { type: String, required: true, trim: true },
            img: { type: String, default: "" },
            video: { type: String, default: "" },
        }],
    }],
    createdAt: { type: Date, default: Date.now },
}, { _id: true, strict: true });

const userSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true, // Elimina espacios en blanco al inicio y al final
        minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
        maxlength: [50, 'El nombre no puede exceder los 50 caracteres']
    },
    Email: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true,
        trim: true,
        lowercase: true, // Convierte todo a minúsculas
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingresa un correo válido'] // Validación Regex
    },
    Password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    Routines: [{
        type: routineSchema,
        default: [],
    }],
}, { strict: true }); // Fuerza el modo estricto para ignorar campos no declarados

// Encriptar contraseña antes de guardar
userSchema.pre("save", async function (next) {
    if (!this.isModified("Password")) return next();
    this.Password = await bcrypt.hash(this.Password, 12);
    next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;