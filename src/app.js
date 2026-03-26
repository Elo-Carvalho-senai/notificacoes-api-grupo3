// src/app.js
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const app = express();
const cors = require("cors");
const responseTime = require("./middlewares/responseTime");
// ... todas as rotas acima ...
// Middleware de rota não encontrada (sempre por último!)
const notFound = require("./middlewares/notFound");
// Middlewares
app.use(express.json());
app.use(cors());
app.use(logger);
app.use(responseTime);
// Documentação Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
const logger = require("./middlewares/logger");
app.use(notFound);
// Rotas
const eventoRoutes = require("./routes/eventoRoutes");
const participanteRoutes = require("./routes/participanteRoutes");
const inscricaoRoutes = require("./routes/inscricaoRoutes");
app.use("/eventos", eventoRoutes);
app.use("/participantes", participanteRoutes);
app.use("/inscricoes", inscricaoRoutes);
// Rota raiz
app.get("/", (req, res) => {
    res.json({
        mensagem: "API de Notificações",
        documentacao: "/api-docs",
        rotas: {
            eventos: "/eventos",
            participantes: "/participantes",
            inscricoes: "/inscricoes",
        },
    });
});
module.exports = app;