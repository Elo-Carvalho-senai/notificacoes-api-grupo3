# Project Charter — API de Notificações
## 1. Nome do Projeto
API de Notificações por E-mail para Plataforma de Eventos
## 2. Objetivo
Desenvolver uma API REST que gerencie o envio de notificações por e-mail
(confirmação de inscrição e lembretes) para participantes de eventos.
## 3. Justificativa
O módulo automatiza a comunicação com os participantes, enviando confirmações e lembretes, evitando falhas manuais e aumentando o engajamento.
## 4. Escopo
### Incluído:
- CRUD de Eventos, Participantes e Inscrições
- Módulo de notificações por e-mail (simulado)
- Documentação com Swagger
- Deploy em plataforma de nuvem
### Não incluído:
- Autenticação de usuários
- Front-end
- Envio de SMS ou push notifications
## 5. Equipe
| Nome | Função/Responsabilidade |
|------|------------------------|
| [Maria Eloisa] | [Pode ser o responsável pelo banco de dados (Models  Migrations).] |
| [Maria Fernanda] | [Pode focar na documentação técnica e Swagger.] |
| [Raissa ] | [Pode ser o responsável pelos testes no Postman e qualidade.] |
| [Isadora ] | [Responsável pela Infraestrutura, Configuração de E-mail e Deploy] |
## 6. Tecnologias
Node.js, Express.js, MySQL, Sequelize, Swagger, Nodemailer, Git/GitHub
## 7. Prazo
Início: [02/04/2026 ] | Entrega final: [16/04/2026 ]
## 8. Critérios de Sucesso
- [ ] API funcional com todos os CRUDs
- [ ] Dados persistidos em MySQL
- [ ] Notificações por e-mail funcionando (simulado)
- [ ] Documentação Swagger completa

- [ ] Deploy realizado
- [ ] Apresentação aprovada