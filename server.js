require("dotenv").config();

// ─── Validación fail-fast de variables de entorno requeridas ──────────────────
const REQUIRED_ENV = ['JWT_SECRET', 'MONGODB_URI', 'NODE_ENV', 'PORT'];
for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`[FATAL] Variable de entorno faltante: ${key}`);
    process.exit(1);
  }
}

const logger = require('./logger');
const helmet = require("helmet");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');
const { rateLimit, ipKeyGenerator } = require('express-rate-limit');
const User = require("./models/user");
const Exercise = require("./models/exercise");
const mongoSanitize = require('express-mongo-sanitize');

const app = express();
const PORT = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET;

const PRODUCTION_BASE_URL = new URL(process.env.APP_BASE_URL || "https://midominio.com");
PRODUCTION_BASE_URL.protocol = "https:";
PRODUCTION_BASE_URL.pathname = "/";
PRODUCTION_BASE_URL.search = "";
PRODUCTION_BASE_URL.hash = "";

function buildHttpsRedirectUrl(req) {
  const requestPath = req.originalUrl || req.url || "/";
  const safePath = requestPath.startsWith("/") && !requestPath.startsWith("//") && !requestPath.includes("\\")
    ? requestPath
    : "/";
  return new URL(safePath, PRODUCTION_BASE_URL.origin).toString();
}

// ─── Ocultar el framework usado ───────────────────────────────────────────────
app.disable("x-powered-by");

// ─── Cabeceras de seguridad con Helmet (HSTS + CSP) ──────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
      scriptSrcElem: ["'self'", "https://cdn.jsdelivr.net"],
      scriptSrcAttr: ["'none'"],
      styleSrc: ["'self'", "https://cdn.jsdelivr.net"],
      styleSrcElem: ["'self'", "https://cdn.jsdelivr.net"],
      styleSrcAttr: ["'none'"],
      fontSrc: ["'self'", "data:"],
      imgSrc: ["'self'", "data:", "https://training.fit", "https://i.pinimg.com", "https://wallpapergod.com"],
      connectSrc: ["'self'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'self'"],
      objectSrc: ["'none'"]
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Cross-Origin-Embedder-Policy
app.use(helmet.crossOriginEmbedderPolicy({ policy: "credentialless" }));

// Permissions-Policy
app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()');
  next();
});

// Cache explícito
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

// ─── Rate Limiters ────────────────────────────────────────────────────────────
const authenticatedLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  keyGenerator: (req) => ipKeyGenerator(req.ip || req.userId),
  message: { message: "Has superado el límite de acciones para tu cuenta. Intenta más tarde." }
});

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Demasiadas peticiones desde esta IP, por favor intenta más tarde." }
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Demasiados intentos de inicio de sesión. Intenta en 15 minutos." }
});

// ─── Body parsing y sanitización ─────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize());
app.use(globalLimiter);

// ─── CORS estricto ────────────────────────────────────────────────────────────
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? PRODUCTION_BASE_URL.origin : 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// ─── Logging: requestId + userId + IP en cada request ────────────────────────
app.use((req, res, next) => {
  req.requestId = uuidv4();
  logger.info({
    event: 'REQUEST',
    requestId: req.requestId,
    ip: req.ip,
    method: req.method,
    path: req.path,
    userId: req.userId || 'unauthenticated',
  });
  next();
});

// ─── Forzar HTTPS en producción ───────────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(301, buildHttpsRedirectUrl(req));
    } else {
      next();
    }
  });
}

// ─── Archivos estáticos ───────────────────────────────────────────────────────
app.use('/fontawesome', express.static(__dirname + '/node_modules/@fortawesome/fontawesome-free'));
app.use(express.static('views'));

// ─── Rutas HTML ───────────────────────────────────────────────────────────────
app.get('/', (req, res) => res.sendFile(__dirname + '/views/home.html'));
app.get('/rutina', (req, res) => res.sendFile(__dirname + '/views/rutina.html'));
app.get('/ejercicios', (req, res) => res.sendFile(__dirname + '/views/ejercicios.html'));
app.get('/calendario', (req, res) => res.sendFile(__dirname + '/views/calendario.html'));

// ─── Middleware de autenticación JWT ─────────────────────────────────────────
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    logger.warn({ event: 'AUTH_NO_TOKEN', ip: req.ip, path: req.path, requestId: req.requestId });
    return res.status(401).json({ message: "Token requerido." });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      logger.warn({ event: 'AUTH_INVALID_TOKEN', ip: req.ip, path: req.path, requestId: req.requestId });
      return res.status(403).json({ message: "Token inválido o expirado." });
    }
    req.userId = decoded.userId;
    next();
  });
}

// ─── Conexión a MongoDB ───────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => logger.info({ event: 'DB_CONNECTED', message: "Conectado a MongoDB" }))
  .catch((err) => {
    logger.error({ event: 'DB_CONNECTION_ERROR', message: err.message });
    process.exit(1);
  });

// ─── Registro de usuario ──────────────────────────────────────────────────────
app.post("/api/users/register", async (req, res) => {
  const { Name, Email, Password } = req.body;

  try {
    const userExists = await User.findOne({ Email });
    if (userExists) {
      logger.warn({ event: 'AUTH_REGISTER_DUPLICATE', email: Email, ip: req.ip, requestId: req.requestId });
      return res.status(400).json({ message: "El usuario ya está registrado." });
    }

    const newUser = new User({ Name, Email, Password });
    await newUser.save();

    logger.info({ event: 'AUTH_REGISTER_SUCCESS', email: Email, ip: req.ip, requestId: req.requestId });
    res.status(201).json({ message: "Usuario registrado con éxito" });
  } catch (error) {
    logger.error({ event: 'ERROR', endpoint: '/api/users/register', message: error.message, requestId: req.requestId });
    res.status(500).json({ message: "Error al registrar usuario" });
  }
});

// ─── Login ────────────────────────────────────────────────────────────────────
app.post("/api/users/login", loginLimiter, async (req, res) => {
  const { Email, Password } = req.body;

  try {
    const user = await User.findOne({ Email });
    if (!user) {
      logger.warn({ event: 'AUTH_LOGIN_FAILED', reason: 'user_not_found', email: Email, ip: req.ip, requestId: req.requestId });
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const isPasswordValid = await bcrypt.compare(Password, user.Password);
    if (!isPasswordValid) {
      logger.warn({ event: 'AUTH_LOGIN_FAILED', reason: 'wrong_password', email: Email, ip: req.ip, requestId: req.requestId });
      return res.status(401).json({ message: "Correo o contraseña incorrecta." });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "2h" });
    logger.info({ event: 'AUTH_LOGIN_SUCCESS', userId: user._id, ip: req.ip, requestId: req.requestId });
    res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      userName: user.Name,
      routines: user.Routines || [],
    });
  } catch (error) {
    logger.error({ event: 'ERROR', endpoint: '/api/users/login', message: error.message, requestId: req.requestId });
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
});

// ─── Generar rutina ───────────────────────────────────────────────────────────
app.post("/api/users/generateRoutine", async (req, res) => {
  const { nivel, objetivo, dias } = req.body;

  try {
    const diasNumero = dias === "1-2" ? 2 : dias === "3-4" ? 4 : 5;
    const ejercicios = await Exercise.find({ level: nivel, category: objetivo });

    if (ejercicios.length > 0) {
      const rutina = [];
      const ejerciciosPorDia = Math.ceil(ejercicios.length / diasNumero);

      for (let i = 0; i < diasNumero; i++) {
        rutina.push({
          day: `Día ${i + 1}`,
          exercises: ejercicios.slice(i * ejerciciosPorDia, (i + 1) * ejerciciosPorDia).map(e => ({
            name: e.name,
            reps: e.reps,
            img: e.img,
            video: e.video,
          })),
        });
      }

      logger.info({ event: 'CRUD_GENERATE_ROUTINE', nivel, objetivo, dias, ip: req.ip, requestId: req.requestId });
      res.status(200).json({ message: "Rutina generada exitosamente", routine: rutina });
    } else {
      logger.warn({ event: 'CRUD_GENERATE_ROUTINE_EMPTY', nivel, objetivo, dias, ip: req.ip, requestId: req.requestId });
      res.status(404).json({ message: "No se encontraron ejercicios para los criterios seleccionados" });
    }
  } catch (error) {
    logger.error({ event: 'ERROR', endpoint: '/api/users/generateRoutine', message: error.message, requestId: req.requestId });
    res.status(500).json({ message: "Error al generar la rutina" });
  }
});

// ─── Guardar rutina ───────────────────────────────────────────────────────────
app.post("/api/users/saveRoutine", authenticateToken, authenticatedLimiter, async (req, res) => {
  const userId = req.userId;
  const { routine } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      logger.warn({ event: 'CRUD_SAVE_ROUTINE_USER_NOT_FOUND', userId, requestId: req.requestId });
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const newRoutine = {
      name: `Rutina ${user.Routines.length + 1}`,
      days: routine,
      createdAt: new Date(),
    };

    user.Routines.push(newRoutine);
    await user.save();

    logger.info({ event: 'CRUD_SAVE_ROUTINE', userId, ip: req.ip, requestId: req.requestId });
    res.status(200).json({ message: "Rutina guardada exitosamente", routine: newRoutine });
  } catch (error) {
    logger.error({ event: 'ERROR', endpoint: '/api/users/saveRoutine', message: error.message, requestId: req.requestId });
    res.status(500).json({ message: "Error al guardar la rutina" });
  }
});

// ─── Obtener rutinas ──────────────────────────────────────────────────────────
app.get("/api/users/routines", authenticateToken, authenticatedLimiter, async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      logger.warn({ event: 'CRUD_GET_ROUTINES_USER_NOT_FOUND', userId, requestId: req.requestId });
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    logger.info({ event: 'CRUD_GET_ROUTINES', userId, ip: req.ip, requestId: req.requestId });
    res.status(200).json({ message: "Rutinas obtenidas exitosamente", routines: user.Routines || [] });
  } catch (error) {
    logger.error({ event: 'ERROR', endpoint: '/api/users/routines', message: error.message, requestId: req.requestId });
    res.status(500).json({ message: "Error al obtener rutinas" });
  }
});

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  logger.warn({ event: 'NOT_FOUND', ip: req.ip, method: req.method, path: req.path, requestId: req.requestId });
  res.status(404).json({ message: "Recurso no encontrado." });
});

// ─── Inicio del servidor ──────────────────────────────────────────────────────
app.listen(PORT, () => {
  logger.info({ event: 'SERVER_START', port: PORT, env: process.env.NODE_ENV });
});
