require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.disable("x-powered-by");

app.use(express.json({
    limit: "10kb"
}));

const PORT = Number(process.env.PORT || 3000);
const NODE_ENV = process.env.NODE_ENV || "development";

// Configuración de CORS
if (process.env.FRONTEND_URL) {
    app.use(cors({
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"]
    }));
}

// Endpoint de bienvenida
app.get("/", (req, res) => {
    res.json({
        mensaje: "Bienvenido a la API, version 2",
        entorno: NODE_ENV
    });
});

// Endpoint de salud
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        servicio: "API Desarrollo Web",
        timestamp: new Date().toISOString()
    });
});

// Endpoint para verificar el cambio desplegado
app.get("/api/version", (req, res) => {
    res.status(200).json({
        version: "2.1.0",
        cambio: "Endpoint de version agregado",
        entorno: NODE_ENV
    });
});

// Obtener productos
app.get("/api/productos", (req, res) => {
    res.status(200).json([
        { id: 1, nombre: "Teclado", precio: 250 },
        { id: 2, nombre: "Mouse", precio: 125 }
    ]);
});

// Validar solicitud de creación de producto
app.post("/api/productos", (req, res) => {
    const { nombre, precio } = req.body || {};

    if (
        typeof nombre !== "string" ||
        !nombre.trim() ||
        typeof precio !== "number" ||
        !Number.isFinite(precio) ||
        precio <= 0
    ) {
        return res.status(400).json({
            error: "Datos de producto inválidos"
        });
    }

    res.status(201).json({
        mensaje: "Solicitud de creación validada",
        producto: {
            nombre: nombre.trim(),
            precio
        },
        persistido: false
    });
});

// Ruta no encontrada
app.use((req, res) => {
    res.status(404).json({
        error: "Ruta no encontrada"
    });
});

// Middleware central de errores
app.use((err, req, res, next) => {
    console.error("Error:", err.message);

    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        error: "Error procesando la solicitud"
    });
});

// Escuchar en todas las interfaces de red
app.listen(PORT, "0.0.0.0", () => {
    console.log(`API ejecutándose en el puerto ${PORT}`);
});