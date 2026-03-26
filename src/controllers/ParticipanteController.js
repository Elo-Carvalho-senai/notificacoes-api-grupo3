// src/controllers/ParticipanteController.js

const ParticipanteModel = require("../models/ParticipanteModel");
const { NotFoundError, ValidationError } = require("../errors/AppError");

// LISTAR TODOS
function index(req, res, next) {
    try {
        const participantes = ParticipanteModel.listar();
        res.json(participantes);
    } catch (erro) {
        next(erro);
    }
}

// BUSCAR POR ID
function show(req, res, next) {
    try {
        const id = parseInt(req.params.id);

        const participante = ParticipanteModel.buscarPorId(id);

        if (!participante) {
            throw new NotFoundError("Participante");
        }

        res.json(participante);
    } catch (erro) {
        next(erro);
    }
}

// CRIAR
function store(req, res, next) {
    try {
        const { nome, email } = req.body;

        // Validação obrigatória
        if (!nome || !email) {
            throw new ValidationError("Nome e email são obrigatórios");
        }

        // Validação extra
        if (email && !email.includes("@")) {
            throw new ValidationError("Email inválido");
        }

        const novoParticipante = ParticipanteModel.criar({ nome, email });

        res.status(201).json(novoParticipante);
    } catch (erro) {
        next(erro);
    }
}

// ATUALIZAR
function update(req, res, next) {
    try {
        const id = parseInt(req.params.id);

        const { nome, email } = req.body;

        const participanteAtualizado = ParticipanteModel.atualizar(id, {
            nome,
            email
        });

        if (!participanteAtualizado) {
            throw new NotFoundError("Participante");
        }

        res.json(participanteAtualizado);
    } catch (erro) {
        next(erro);
    }
}

// DELETAR
function destroy(req, res, next) {
    try {
        const id = parseInt(req.params.id);

        const deletado = ParticipanteModel.deletar(id);

        if (!deletado) {
            throw new NotFoundError("Participante");
        }

        res.status(204).send();
    } catch (erro) {
        next(erro);
    }
}

module.exports = { index, show, store, update, destroy };