// --- 📦 Imports principaux ---
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { Server } = require("socket.io");
const { createServer } = require("http");
const path = require("path");
require("dotenv").config();

// --- 🗄️ Base de données (Sequelize) ---
const db = require("./models");
const { logger, requestLogger } = require("./utils/logger");

// --- ⚙️ Middlewares & Routes ---
const { errorHandler } = require("./middleware/errorHandler");
const authRoutes = require("./routes/auth");
const jobRoutes = require("./routes/job");
const applicationsRouter = require("./routes/applications");
const dashboardRouter = require("./routes/dashboard");
const userRoutes = require("./routes/users");
const filesRouter = require("./routes/files");
const testimonialRoutes = require("./routes/testimonials");
const reportRoutes = require("./routes/reports");

// --- 🌍 CORS ---
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.FRONTEND_URL,
].filter(Boolean);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  },
});

// --- 🧠 Sécurité & limitations ---
app.use(helmet());
app.use(cors({ origin: allowedOrigins, credentials: true }));

// ✅ PARSERS EN PREMIER (avant les routes)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// --- 📂 Fichiers statiques (uploads) ---
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// ✅ Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Overwork API (SQL Version) fonctionne ✅",
    timestamp: new Date().toISOString(),
  });
});

// --- 🧱 Rate limiting ---
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1100,
  message: { error: "Trop de requêtes, réessayez dans 15 minutes." },
});
app.use("/api/", limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 305,
  message: {
    error: "Trop de tentatives de connexion, réessayez dans 15 minutes.",
  },
});

// --- 🚦 Routes principales ---
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/jobs", jobRoutes(io));
app.use("/api/applications", applicationsRouter(io));
app.use("/api/dashboard", dashboardRouter(io));
app.use("/api/users", userRoutes(io));
app.use("/api/files", filesRouter);
app.use("/api/testimonials", testimonialRoutes(io));
app.use("/api/reports", reportRoutes);
// Sert les fichiers statiques du dossier 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- 🧩 WebSocket ---
io.on("connection", (socket) => {
  logger.info("Utilisateur connecté:", socket.id);

  socket.on("join-user-room", (userId) => {
    if (userId) {
      socket.join(`user-${userId}`);
      logger.info(`Utilisateur ${userId} rejoint sa room.`);
    }
  });

  socket.on("new-application", (data) => {
    io.to(`user-${data.clientId}`).emit("application-received", {
      jobId: data.jobId,
      jobTitle: data.jobTitle,
      candidateName: data.candidateName,
      timestamp: new Date(),
    });
  });

  socket.on("application-status-update", (data) => {
    io.to(`user-${data.candidateId}`).emit("application-updated", {
      applicationId: data.applicationId,
      status: data.status,
      jobTitle: data.jobTitle,
      timestamp: new Date(),
    });
  });

  socket.on("disconnect", () => {
    logger.info("Utilisateur déconnecté:", socket.id);
  });
});

// --- 🧰 Middleware global d'erreur ---
app.use(errorHandler);

// --- 🚀 Démarrage du serveur ---
const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    logger.info("✅ Connexion à la base MySQL réussie.");
    await db.sequelize.sync({ alter: true });
    logger.info("🔄 Modèles synchronisés avec la base.");

    server.listen(PORT, () => {
      logger.info(`🚀 Serveur lancé sur http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error("❌ Erreur de démarrage du serveur:", error);
    process.exit(1);
  }
};

// --- 🛑 Fermeture propre ---
const shutdown = () => {
  logger.info("🛑 Arrêt du serveur en cours...");
  server.close(() => {
    db.sequelize.close().then(() => {
      logger.info("Connexion BDD fermée. ✅");
      process.exit(0);
    });
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

// Lancement
startServer();

module.exports = { io };