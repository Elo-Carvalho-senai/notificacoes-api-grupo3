// src/controllers/ParticipanteController.js

const ParticipanteModel = require("../models/ParticipanteModel");

// LISTAR TODOS
function index(req, res) {
    const participantes = ParticipanteModel.listar();
    res.json(participantes);
}

// BUSCAR POR ID
function show(req, res) {
    const id = parseInt(req.params.id);

    const participante = ParticipanteModel.buscarPorId(id);

    if (!participante) {
        return res.status(404).json({ erro: "Participante não encontrado" });
    }

    res.json(participante);
}

// CRIAR
function store(req, res) {
    const { nome, email } = req.body;

    // Validação
    if (!nome || !email) {
        return res.status(400).json({ erro: "Nome e email são obrigatórios" });
    }

    const novoParticipante = ParticipanteModel.criar({ nome, email });

    res.status(201).json({
        mensagem: "Participante criado com sucesso!",
        participante: novoParticipante
    });
}

// ATUALIZAR
function update(req, res) {
    const id = parseInt(req.params.id);
    const { nome, email } = req.body;

    const participanteAtualizado = ParticipanteModel.atualizar(id, { nome, email });

    if (!participanteAtualizado) {
        return res.status(404).json({ erro: "Participante não encontrado" });
    }

    res.json({
        mensagem: "Participante atualizado com sucesso!",
        participante: participanteAtualizado
    });
}

// DELETAR
function destroy(req, res) {
    const id = parseInt(req.params.id);

    const deletado = ParticipanteModel.deletar(id);

    if (!deletado) {
        return res.status(404).json({ erro: "Participante não encontrado" });
    }

    res.status(204).send(); // sem conteúdo
}

module.exports = { index, show, store, update, destroy };