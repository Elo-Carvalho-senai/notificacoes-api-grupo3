# 📧 Notificações API

API REST para o módulo de notificações por e-mail de uma plataforma de gerenciamento de eventos.

---

## 📋 Sobre o Projeto

Este projeto faz parte da Situação de Aprendizagem do curso de Programação Back-End do SENAI.

A API é responsável por gerenciar:
- Eventos
- Participantes
- Inscrições

E enviar notificações como:
- Confirmação de inscrição
- Lembretes de eventos

---

## 🛠️ Tecnologias Utilizadas

- Node.js
- Express.js
- Swagger (swagger-jsdoc + swagger-ui-express)
- Dotenv
- Nodemon
- CORS

---

## 📁 Estrutura do Projeto
src/
├── controllers/
├── services/
├── models/
├── routes/
├── middlewares/
├── errors/
├── helpers/
├── swagger.js
├── app.js
└── server.js


## 🔧 Scripts
| Comando | Descrição |
|---------|-----------|
| `npm start` | Inicia o servidor (produção) |
| `npm run dev` | Inicia com Nodemon (desenvolvimento) |


## 📊 Visão Geral da Arquitetura

A aplicação segue uma arquitetura em camadas, separando responsabilidades em diferentes partes do sistema.

### Camadas:

- **Controller:** recebe requisições e retorna respostas
- **Service:** contém regras de negócio e validações
- **Model:** manipula os dados
- **Routes:** define as rotas da API
- **Helpers:** funções reutilizáveis (ex: validações, parseId)
- **Errors:** tratamento de erros personalizados

### Fluxo da aplicação:

Request → Route → Controller → Service → Model → Response

Essa estrutura facilita a organização, manutenção e escalabilidade do sistema.

## 🚀 Como Rodar
1. Clone o repositório:
```bash
git clone https://github.com/Elo-Carvalho-senai/notificacoes-api-grupo3.git
