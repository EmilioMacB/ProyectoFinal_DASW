const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre del ejercicio es obligatorio'],
        trim: true,
        maxlength: [100, 'El nombre no puede exceder los 100 caracteres']
    },
    category: {
        type: String,
        required: [true, 'La categoría es obligatoria'],
        trim: true,
        // Enum actúa como un "Allowlist" estricto
        enum: {
            values: ['peso', 'musculo', 'condicion'],
            message: '{VALUE} no es una categoría de ejercicio válida'
        }
    },
    level: {
        type: String,
        required: [true, 'El nivel es obligatorio'],
        trim: true,
        // Enum restringe a los 3 niveles de tu cuestionario
        enum: {
            values: ['novato', 'intermedio', 'avanzado'],
            message: '{VALUE} no es un nivel válido'
        }
    },
    reps: {
        type: String,
        required: [true, 'Las repeticiones son obligatorias'],
        trim: true,
        maxlength: [50, 'El texto de repeticiones es demasiado largo']
    },
    img: {
        type: String,
        required: [true, 'La imagen es obligatoria'],
        trim: true,
        // Expresión regular básica para asegurar que comience con http:// o https://
        match: [/^https?:\/\/.+/, 'La imagen debe ser una URL válida']
    },
    video: {
        type: String,
        trim: true,
        default: "",
        // Validador personalizado: permite que esté vacío, pero si tiene texto, debe ser URL
        validate: {
            validator: function(v) {
                return v === "" || /^https?:\/\/.+/.test(v);
            },
            message: 'El video debe ser una URL válida o estar vacío'
        }
    }
}, { strict: true });

module.exports = mongoose.model("Exercise", exerciseSchema);