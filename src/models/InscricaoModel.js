// src/models/InscricaoModel.js

let inscricoes = [];
let idAtual = 1;

// CRIAR
function criar(eventoId, participanteId) {
    const nova = {
        id: idAtual++,
        eventoId,
        participanteId,
        status: "ativa"
    };

    inscricoes.push(nova);
    return nova;
}

// LISTAR TODAS
function listar() {
    return inscricoes;
}

// LISTAR POR EVENTO
function listarPorEvento(eventoId) {
    return inscricoes.filter(i => i.eventoId === eventoId);
}

// CANCELAR
function cancelar(id) {
    const inscricao = inscricoes.find(i => i.id === id);

    if (!inscricao) return null;

    inscricao.status = "cancelada";
    return inscricao;
}

module.exports = {
    criar,
    listar,
    listarPorEvento,
    cancelar
};