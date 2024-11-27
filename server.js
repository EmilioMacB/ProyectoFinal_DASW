const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const User = require("./models/user");
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

    console.log("Datos recibidos en el backend:", req.body);

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

        res.status(200).json({ message: "Inicio de sesión exitoso", userId: user._id });
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        res.status(500).json({ message: "Error al iniciar sesión", error });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
