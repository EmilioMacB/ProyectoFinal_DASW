const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const User = require("./models/user");
const Exercise = require("./models/exercise");
const app = express();
const PORT = 3000; // Cambia el puerto si es necesario

// Middleware para analizar JSON
app.use(express.json());

// Habilitar CORS para permitir solicitudes desde el frontend
app.use(cors());

// Conectar a MongoDB
mongoose
    .connect("mongodb+srv://admin:Chocolate20@cluster0.jljyt.mongodb.net/crud")
    .then(() => console.log("Conectado a MongoDB en la base de datos 'crud'"))
    .catch((err) => console.error("Error al conectar a MongoDB:", err));

// Ruta para registrar usuarios
app.post("/api/users/register", async (req, res) => {
    const { Name, Email, Password } = req.body;

    try {
        const userExists = await User.findOne({ Email });
        if (userExists) {
            return res.status(400).json({ message: "El usuario ya está registrado." });
        }

        const newUser = new User({ Name, Email, Password });
        await newUser.save();

        res.status(201).json({ message: "Usuario registrado con éxito" });
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        res.status(500).json({ message: "Error al registrar usuario", error });
    }
});

// Ruta para iniciar sesión
app.post("/api/users/login", async (req, res) => {
    const { Email, Password } = req.body;

    try {
        const user = await User.findOne({ Email });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        const isPasswordValid = await bcrypt.compare(Password, user.Password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Contraseña incorrecta." });
        }

        res.status(200).json({
            message: "Inicio de sesión exitoso",
            userId: user._id,
            routine: user.Routine || null, // Devuelve la rutina guardada si existe
        });
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        res.status(500).json({ message: "Error al iniciar sesión", error });
    }
});

// Ruta para generar una rutina personalizada basada en la base de datos
app.post("/api/users/generateRoutine", async (req, res) => {
    const { nivel, objetivo, dias } = req.body;

    try {
        console.log("Respuestas recibidas:", { nivel, objetivo, dias });

        // Convertir `dias` a un número, por si llega como string
        const diasNumero = dias === "1-2" ? 2 : dias === "3-4" ? 4 : 5;

        // Buscar ejercicios en la base de datos
        const ejercicios = await Exercise.find({ level: nivel, category: objetivo });

        console.log("Ejercicios encontrados:", ejercicios);

        if (ejercicios.length > 0) {
            const rutina = [];
            const ejerciciosPorDia = Math.ceil(ejercicios.length / diasNumero);

            for (let i = 0; i < diasNumero; i++) {
                rutina.push({
                    day: `Día ${i + 1}`,
                    exercises: ejercicios.slice(i * ejerciciosPorDia, (i + 1) * ejerciciosPorDia).map(ejercicio => ({
                        name: ejercicio.name,
                        reps: ejercicio.reps,
                        img: ejercicio.img,
                        video: ejercicio.video,
                    })),
                });
            }

            console.log("Rutina generada:", rutina);
            res.status(200).json({ message: "Rutina generada exitosamente", routine: rutina });
        } else {
            console.log("No se encontraron ejercicios para los criterios seleccionados");
            res.status(404).json({ message: "No se encontraron ejercicios para los criterios seleccionados" });
        }
    } catch (error) {
        console.error("Error al generar la rutina:", error);
        res.status(500).json({ message: "Error al generar la rutina", error });
    }
});


// Ruta para guardar la rutina en el perfil del usuario
app.post("/api/users/saveRoutine", async (req, res) => {
    const { userId, routine } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        user.Routine = routine;
        await user.save();

        res.status(200).json({ message: "Rutina guardada exitosamente" });
    } catch (error) {
        console.error("Error al guardar la rutina:", error);
        res.status(500).json({ message: "Error al guardar la rutina", error });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
