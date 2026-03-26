// src/controllers/InscricaoController.js

const InscricaoModel = require("../models/InscricaoModel");
const EventoModel = require("../models/EventoModel");
const ParticipanteModel = require("../models/ParticipanteModel");
const { NotFoundError, ValidationError } = require("../errors/AppError");

// GET /inscricoes/:id/detalhes
function detalhes(req, res, next) {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            throw new ValidationError("ID inválido");
        }

        const inscricao = InscricaoModel.listar().find(i => i.id === id);

        if (!inscricao) {
            throw new NotFoundError("Inscrição");
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

        res.json(resposta);
    } catch (erro) {
        next(erro);
    }
}

// POST /inscricoes
function store(req, res, next) {
    try {
        const { eventoId, participanteId } = req.body || {};

        if (!eventoId || !participanteId) {
            throw new ValidationError("eventoId e participanteId são obrigatórios");
        }

        const resultado = InscricaoModel.criar(
            parseInt(eventoId),
            parseInt(participanteId)
        );

        res.status(201).json(resultado);
    } catch (erro) {
        next(erro);
    }
}

// GET /inscricoes
function index(req, res, next) {
    try {
        const inscricoes = InscricaoModel.listar();
        res.json(inscricoes);
    } catch (erro) {
        next(erro);
    }
}

// GET /inscricoes/evento/:eventoId
function listarPorEvento(req, res, next) {
    try {
        const eventoId = parseInt(req.params.eventoId);

        if (isNaN(eventoId)) {
            throw new ValidationError("ID do evento inválido");
        }

        const inscricoes = InscricaoModel.listarPorEvento(eventoId);

        res.json(inscricoes);
    } catch (erro) {
        next(erro);
    }
}

// PATCH /inscricoes/:id/cancelar
function cancelar(req, res, next) {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            throw new ValidationError("ID inválido");
        }

        const inscricao = InscricaoModel.cancelar(id);

        if (!inscricao) {
            throw new NotFoundError("Inscrição");
        }

        res.json({
            mensagem: "Inscrição cancelada com sucesso!",
            inscricao
        });
    } catch (erro) {
        next(erro);
    }
}

module.exports = { store, index, listarPorEvento, cancelar, detalhes };