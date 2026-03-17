const express = require('express');
const app = express();

// 🔥 SEMPRE NO TOPO
app.use(express.json());

// ROTAS
const participanteRoutes = require('./routes/participanteRoutes');
const eventoRoutes = require('./routes/eventoRoutes');
const inscricaoRoutes = require('./routes/inscricaoRoutes');

app.use("/participantes", participanteRoutes);
app.use("/eventos", eventoRoutes);
app.use("/inscricoes", inscricaoRoutes);

// ROTA TESTE
app.get("/", (req, res) => {
    res.json({
        mensagem: "API funcionando 🚀"
    });
});

// EXPORTA SÓ NO FINAL
module.exports = app;