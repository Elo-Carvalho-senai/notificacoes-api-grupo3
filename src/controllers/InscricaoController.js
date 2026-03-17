// src/controllers/InscricaoController.js 

const InscricaoModel = require("../models/InscricaoModel");
const EventoModel = require("../models/EventoModel");
const ParticipanteModel = require("../models/ParticipanteModel");

// GET /inscricoes/:id/detalhes
function detalhes(req, res) {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ erro: "ID inválido" });
    }

    const inscricao = InscricaoModel.listar().find(i => i.id === id);

    if (!inscricao) {
        return res.status(404).json({ erro: "Inscrição não encontrada" });
    }

    const evento = EventoModel.listar().find(e => e.id === inscricao.eventoId);

    const participante = ParticipanteModel.listar().find(
        p => p.id === inscricao.participanteId
    );

    const resposta = {
        id: inscricao.id,
        status: inscricao.status,
        dataInscricao: inscricao.dataInscricao || null,
        evento: evento
            ? { id: evento.id, nome: evento.nome }
            : null,
        participante: participante
            ? {
                  id: participante.id,
                  nome: participante.nome,
                  email: participante.email
              }
            : null
    };

    return res.json(resposta);
}

// POST /inscricoes
function store(req, res) {
    const { eventoId, participanteId } = req.body || {};

    if (!eventoId || !participanteId) {
        return res
            .status(400)
            .json({ erro: "eventoId e participanteId são obrigatórios" });
    }

    const resultado = InscricaoModel.criar(
        parseInt(eventoId),
        parseInt(participanteId)
    );

    if (resultado?.erro) {
        return res.status(400).json(resultado);
    }

    return res.status(201).json(resultado);
}

// GET /inscricoes
function index(req, res) {
    const inscricoes = InscricaoModel.listar();
    return res.json(inscricoes);
}

// GET /inscricoes/evento/:eventoId
function listarPorEvento(req, res) {
    const eventoId = parseInt(req.params.eventoId);

    if (isNaN(eventoId)) {
        return res.status(400).json({ erro: "ID do evento inválido" });
    }

    const inscricoes = InscricaoModel.listarPorEvento(eventoId);

    return res.json(inscricoes);
}

// PATCH /inscricoes/:id/cancelar
function cancelar(req, res) {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ erro: "ID inválido" });
    }

    const inscricao = InscricaoModel.cancelar(id);

    if (!inscricao) {
        return res.status(404).json({ erro: "Inscrição não encontrada" });
    }

    return res.json({
        mensagem: "Inscrição cancelada com sucesso!",
        inscricao
    });
}

module.exports = { store, index, listarPorEvento, cancelar, detalhes };