require("dotenv").config();
const helmet = require("helmet"); // libreria para agregar Content Security Policy
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { rateLimit, ipKeyGenerator } = require('express-rate-limit');
const User = require("./models/user");
const Exercise = require("./models/exercise");
const mongoSanitize = require('express-mongo-sanitize'); // librería para prevenir inyecciones NoSQL
const app = express();
const PORT = process.env.PORT; // Cambia el puerto si es necesario

// Ocultar el framework usado 
app.disable("x-powered-by");

// Cabeceras de seguridad con Helmet (incluye HSTS y CSP)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://cdn.jsdelivr.net", "https://kit.fontawesome.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://ka-f.fontawesome.com"],
      imgSrc: ["'self'", "data:", "https://training.fit", "https://i.pinimg.com", "https://wallpapergod.com"],
      connectSrc: ["'self'", "https://ka-f.fontawesome.com"]
    },
  },
  hsts: {
    maxAge: 31536000, // 1 año en segundos
    includeSubDomains: true,
    preload: true
  }
}));

const JWT_SECRET = process.env.JWT_SECRET;



// Rate Limiting para usuarios autenticados (Por userId)
const authenticatedLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 50, // Límite de 50 peticiones por usuario en este lapso
    keyGenerator: (req) => ipKeyGenerator(req.ip || req.userId), // Identificamos al usuario por su ID (extraído del JWT) o por su IP si no hay ID
    message: { message: "Has superado el límite de acciones para tu cuenta. Intenta más tarde." }
});

// Middleware para analizar JSON con límite de tamaño (Prevención de DoS por payloads gigantes)
app.use(express.json({ limit: '10kb' }));

// Sanitización de datos contra inyecciones NoSQL
app.use(mongoSanitize());


// Rate Limiting Global (Por IP)
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Límite de 100 peticiones por IP cada 15 min
    message: { message: "Demasiadas peticiones desde esta IP, por favor intenta más tarde." }
  });
  app.use(globalLimiter);
  
  // Rate Limiting Específico para Login (Prevención de fuerza bruta)
  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // Solo 5 intentos de login fallidos por IP
    message: { message: "Demasiados intentos de inicio de sesión. Intenta en 15 minutos." }
  });


// CORS Estricto
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? 'https://midominio.com' : 'http://localhost:3000',
  methods: ['GET', 'POST'], // Solo permitimos los métodos que tu API realmente usa
  allowedHeaders: ['Content-Type', 'Authorization'] // Solo permitimos estos headers
};
app.use(cors(corsOptions));

// Forzar HTTPS en Producción
if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
      if (req.header('x-forwarded-proto') !== 'https') {
        res.redirect(`https://${req.header('host')}${req.url}`);
      } else {
        next();
      }
    });
  }

// Servir archivos estáticos desde la carpeta views
app.use(express.static('views'));

// Rutas para servir páginas HTML
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/home.html');
});

app.get('/rutina', (req, res) => {
    res.sendFile(__dirname + '/views/rutina.html');
});

app.get('/ejercicios', (req, res) => {
    res.sendFile(__dirname + '/views/ejercicios.html');
});

app.get('/calendario', (req, res) => {
    res.sendFile(__dirname + '/views/calendario.html');
});

// Middleware de autenticación JWT
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>"
    if (!token) return res.status(401).json({ message: "Token requerido." });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Token inválido o expirado." });
        req.userId = decoded.userId; // userId extraído del token firmado
        next();
    });
}

// Conectar a MongoDB
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Conectado a MongoDB en la base de datos 'Bfit'"))
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
app.post("/api/users/login", loginLimiter, async (req, res) => {
    const { Email, Password } = req.body;

    try {
        const user = await User.findOne({ Email });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        const isPasswordValid = await bcrypt.compare(Password, user.Password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Correo o contraseña incorrecta." });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "2h" });
        res.status(200).json({
            message: "Inicio de sesión exitoso",
            token,
            userName: user.Name,
            routines: user.Routines || [],
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
app.post("/api/users/saveRoutine", authenticateToken, authenticatedLimiter, async (req, res) => {
    const userId = req.userId; // del token, nunca del body
    const { routine } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const newRoutine = {
            name: `Rutina ${user.Routines.length + 1}`,
            days: routine,
            createdAt: new Date(),
        };

        user.Routines.push(newRoutine);
        await user.save();

        res.status(200).json({
            message: "Rutina guardada exitosamente",
            routine: newRoutine,
        });
    } catch (error) {
        console.error("Error al guardar la rutina:", error);
        res.status(500).json({ message: "Error al guardar la rutina", error });
    }
});

// Ruta para obtener todas las rutinas del usuario
app.get("/api/users/routines", authenticateToken, authenticatedLimiter, async (req, res) => {
    const userId = req.userId;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json({
            message: "Rutinas obtenidas exitosamente",
            routines: user.Routines || [],
        });
    } catch (error) {
        console.error("Error al obtener rutinas:", error);
        res.status(500).json({ message: "Error al obtener rutinas", error });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
