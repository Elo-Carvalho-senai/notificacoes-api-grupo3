// src/models/ParticipanteModel.js

let participantes = [
    { id: 1, nome: "João", email: "joao@email.com" },
    { id: 2, nome: "Maria", email: "maria@email.com" },
    { id: 3, nome: "Ana", email: "ana@email.com" }
];

let idAtual = 4;

function listar() {
    return participantes;
}

function buscarPorId(id) {
    return participantes.find(p => p.id === id);
}

function criar({ nome, email }) {
    const novo = {
        id: idAtual++,
        nome,
        email
    };

    participantes.push(novo);
    return novo;
}

function atualizar(id, dados) {
    const index = participantes.findIndex(p => p.id === id);

    if (index === -1) return null;

    participantes[index] = {
        ...participantes[index],
        ...dados
    };

    return participantes[index];
}

function deletar(id) {
    const index = participantes.findIndex(p => p.id === id);

    if (index === -1) return false;

    participantes.splice(index, 1);
    return true;
}

module.exports = {
    listar,
    buscarPorId,
    criar,
    atualizar,
    deletar
};