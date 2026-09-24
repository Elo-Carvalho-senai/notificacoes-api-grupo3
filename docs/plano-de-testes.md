# Plano de Testes — Módulo de Notificações da Plataforma de Eventos

## 1. Identificação

* **Sistema:** Plataforma de Gestão de Eventos

* **Módulo:** Módulo de Notificações

* **Versão:** 1.0.0-draft

* **Repositório:** github.com/grupo/plataforma-eventos

* **Grupo / Integrantes:** Raissa Fernandes, Maria Eloisa, Maria Fernanda, Isadora Moraes

* **Data de elaboração:** 20/08/2026

* **Última revisão:** 24/09/2026

---

## 2. Objetivo e escopo

### 2.1 Objetivo

Garantir o envio confiável, pontual e seguro das notificações aos usuários, validando a integridade dos dados e das rotas críticas do módulo contra falhas operacionais.

### 2.2 Dentro do escopo

* **Envio de e-mails de confirmação e disparo de notificações push:** Garantir o recebimento dos e-mails transacionais e avisos push para os inscritos.

* **Persistência de histórico de notificações:** Validar a gravação correta do status (enviado, pendente, falhou) no banco de dados.

* **Validação e segurança de endpoints:** Assegurar autenticação via JWT, autorização de acesso e validação do payload de entrada.

* **Agendamento de notificações:** Testar o correto processamento de filas e disparos temporizados via worker/cron.

### 2.3 Fora do escopo

| O que não será testado                                  | Níveis previstos    | Motivo                                                                                                                                         |
| :------------------------------------------------------ | :------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------- |
| Serviço externo de entrega de e-mail (ex: SendGrid/SES) | E2E Real            | Escopo limitado ao processamento interno; utiliza-se servidor SMTP fake (Mailtrap/Nodemailer mock) para evitar custos e dependências externas. |
| Módulo de Pagamentos e Check-out                        | Teste de Sistema    | Objeto de teste de outra equipe no semestre.                                                                                                   |
| Carga/Estresse extremo acima de 50.000 requisições/s    | Teste de Desempenho | Fora dos requisitos não funcionais definidos para esta entrega formativa.                                                                      |

---

## 3. Itens a testar

|  #  | Item a testar                                                                                        | Camada                    | Arquivo/rota de origem                      |
| :-: | :--------------------------------------------------------------------------------------------------- | :------------------------ | :------------------------------------------ |
|  1  | Validação do token JWT no middleware de autenticação                                                 | Middleware / Segurança    | `src/middlewares/auth.js`                   |
|  2  | Validação do payload no disparo de notificação (`POST /api/notifications`)                           | Controllers / API         | `src/controllers/notificationController.js` |
|  3  | Processamento de mensagens na fila de e-mails (Queue/Worker)                                         | Services / Background Job | `src/services/queueService.js`              |
|  4  | Atualização do status da notificação no banco de dados após envio                                    | Models / Database         | `src/models/Notification.js`                |
|  5  | Consulta do histórico de notificações por usuário (`GET /api/notifications/user/:id`)                | Controllers / API         | `src/routes/notificationRoutes.js`          |
|  6  | Formatação do template HTML do e-mail de confirmação                                                 | Template / Service        | `src/services/emailTemplateService.js`      |
|  7  | Tratamento de falhas na conexão com o banco de dados MongoDB/PostgreSQL                              | Infrastructure / Database | `src/config/database.js`                    |
|  8  | Mecanismo de reentrega (retry) em caso de falha no envio de push notification                        | Services                  | `src/services/pushNotificationService.js`   |
|  9  | Limitação de taxa de requisições por IP (**Rate Limiting**) no envio                                 | Middleware / Segurança    | `src/middlewares/rateLimiter.js`            |
|  10 | Cancelamento de notificações agendadas em fila                                                       | Services / Queue          | `src/services/schedulerService.js`          |
|  11 | Validação de permissão de administrador para disparos em massa (`POST /api/notifications/broadcast`) | Middleware / ACL          | `src/middlewares/checkRole.js`              |
|  12 | Sanitização contra XSS nos parâmetros do corpo da mensagem de notificação                            | Security / Utils          | `src/utils/sanitizer.js`                    |

---

## 4. Análise de risco

### Tabela de Riscos Ordenada (PxI Decrescente)

|  #  | Item                                                      |  P  |  I  | Risco (PxI) |  Grau | Decisão     | Justificativa                                                                |
| :-: | :-------------------------------------------------------- | :-: | :-: | :---------: | :---: | :---------- | :--------------------------------------------------------------------------- |
|  1  | Validação do token JWT no middleware                      |  2  |  5  |    **10**   |  Alto | **Mitigar** | Falha de autenticação expõe dados sigilosos e permite acesso não autorizado. |
|  3  | Processamento de mensagens na fila de e-mails             |  3  |  3  |    **9**    | Médio | **Mitigar** | Falhas na fila provocam perda de envios de e-mails em massa.                 |
|  7  | Tratamento de falhas de conexão com o banco               |  2  |  4  |    **8**    | Médio | **Mitigar** | Queda do banco indisponibiliza persistência das notificações.                |
|  8  | Reentrega (retry) no envio de push notification           |  3  |  2  |    **6**    | Médio | **Mitigar** | Evita a perda de notificações push essenciais para os usuários.              |
|  2  | Validação de payload (`POST /api/notifications`)          |  2  |  3  |    **6**    | Médio | **Mitigar** | Evita requisições malformadas de quebrarem o servidor.                       |
|  11 | Validação de permissão Admin no Broadcast                 |  1  |  5  |    **5**    | Médio | **Mitigar** | Impede o envio de notificações globais por usuários comuns.                  |
|  4  | Atualização de status no banco de dados                   |  2  |  2  |    **4**    | Baixo | **Aceitar** | Inconsistência pontual de status não afeta a entrega da mensagem.            |
|  9  | Limitação de taxa (**Rate Limiting**)                     |  1  |  4  |    **4**    | Baixo | **Aceitar** | Ataques DoS são mitigados em nível de infraestrutura/cloud.                  |
|  12 | Sanitização contra XSS no corpo da mensagem               |  1  |  4  |    **4**    | Baixo | **Mitigar** | Evita injeções maliciosas exibidas no front-end do usuário.                  |
|  5  | Consulta de histórico (`GET /api/notifications/user/:id`) |  2  |  2  |    **4**    | Baixo | **Aceitar** | Rota apenas de leitura sem impacto na regra de negócio de envio.             |
|  10 | Cancelamento de notificações agendadas                    |  2  |  2  |    **4**    | Baixo | **Aceitar** | Funcionalidade pouco acessada e de impacto limitado.                         |
|  6  | Formatação de template HTML de e-mail                     |  2  |  1  |    **2**    | Baixo | **Aceitar** | Erros no HTML geram problemas visuais, sem comprometer a entrega.            |

* **Legenda de Grau:** B (1-4) | M (5-9) | A (10-15) | C (16-25)

* **Decisões possíveis:** Mitigar, Aceitar, Transferir, Evitar.

### 4.1 Top 5 Itens de Maior Risco (Prioridade de Execução)

1. **Validação do token JWT no middleware** (Risco: 10)

2. **Processamento de mensagens na fila de e-mails** (Risco: 9)

3. **Tratamento de falhas na conexão com o banco de dados** (Risco: 8)

4. **Mecanismo de reentrega (retry) de push notifications** (Risco: 6)

5. **Validação do payload no disparo de notificação** (Risco: 6)

### 4.2 Cinco Itens de Maior Risco

1. **Validação do token JWT no middleware** — Risco: **10**
   Prioridade alta por envolver autenticação e acesso não autorizado a dados do sistema.

2. **Processamento de mensagens na fila de e-mails** — Risco: **9**
   Falhas na fila podem provocar perda ou atraso no envio de notificações.

3. **Tratamento de falhas na conexão com o banco de dados** — Risco: **8**
   A indisponibilidade do banco pode impedir a persistência das notificações.

4. **Mecanismo de reentrega (retry) no envio de push notifications** — Risco: **6**
   O mecanismo deve ser testado para reduzir a perda de notificações quando ocorrer uma falha de envio.

5. **Validação do payload no disparo de notificação** — Risco: **6**
   A validação evita que dados incorretos ou malformados sejam processados pela API.

---

## 5. Técnicas e níveis selecionados

| Item/camada                              | Nível(is)              | Técnica(s)                                                             | Justificativa                                                                                                           |
| :--------------------------------------- | :--------------------- | :--------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------- |
| **Middlewares / Segurança** (JWT, Roles) | Unitário / Integração  | Caixa-Preta (Tabela de Decisão) / Caixa-Branca (Cobertura de Caminhos) | Assegurar que todas as ramificações de autorização e negação de tokens expirados/inválidos sejam testadas com precisão. |
| **Queue / Background Workers**           | Integração             | Caixa-Branca (Análise de Valor Limite)                                 | Validar o comportamento da fila com payload nulo, estourado ou com dados truncados.                                     |
| **API Endpoints** (POST/GET)             | Integração (Supertest) | Caixa-Preta (Particionamento por Equivalência)                         | Garantir respostas HTTP adequadas (200, 400, 401, 403, 500) aos inputs.                                                 |
| **Models / Persistência**                | Unitário               | Mocking / Stubbing                                                     | Assegurar que os comandos do banco funcionam sem depender da base de produção.                                          |

### 5.1 Mudanças de Prioridade em Relação à Matriz Anterior

Sim. A rota de envio em massa (`broadcast`) e o middleware JWT subiram de prioridade devido ao risco crítico de segurança e vulnerabilidade identificado na análise de PxI realizada hoje.

---

## 6. Critérios de entrada e de saída

### 6.1 Critérios de entrada

* [x] Código do Módulo de Notificações commitado na **branch** `main` ou `develop`.

* [x] Repositório configurado com as dependências do framework de teste instaladas (`Jest` / `Supertest`).

* [x] Ambiente de testes isolado e banco de dados temporário (**In-Memory** ou Docker) operacional.

### 6.2 Critérios de saída

* [x] **100% dos itens de risco Alto (Grau A e C) executados e aprovados** sem falhas abertas.

* [x] **Cobertura de linhas ≥ 60% nos helpers** obtida no relatório do Jest.

* [x] **0 defeitos de severidade Crítica ou Alta em aberto** nas rotas da API.

---

## 7. Ambiente e ferramentas

| Item                                  | Definição                                                                 |
| :------------------------------------ | :------------------------------------------------------------------------ |
| **Runtime**                           | Node.js v20.x LTS                                                         |
| **Banco de dados de teste**           | SQLite em memória (`:memory:`) ou MongoDB Memory Server                   |
| **Framework de teste**                | Jest                                                                      |
| **Teste de endpoint**                 | Supertest                                                                 |
| **Serviço de e-mail nos testes**      | Mailtrap (ou utilitário de mock interno `nodemailer-mock`)                |
| **Variáveis de ambiente específicas** | `.env.test` (contendo `NODE_ENV=test`, `PORT=3001`, `JWT_SECRET=testkey`) |
| **Onde a suíte será executada**       | Localmente via terminal e pipelines automatizadas via GitHub Actions      |

### 7.1 Isolamento do Banco de Dados

**Não**, o banco de testes não será o mesmo do ambiente de desenvolvimento. Ele funcionará de forma isolada (via banco em memória ou container Docker descartável) para evitar a contaminação, limpeza acidental ou alteração de dados de desenvolvimento durante a execução das suítes de teste automatizadas.

---

## 8. Cronograma

| Etapa                                               | Datas previstas | Responsável      | Entrega                                   |
| :-------------------------------------------------- | :-------------- | :--------------- | :---------------------------------------- |
| Configuração do ambiente Jest e estruturas de Mocks | 27/08/2026      | Raissa Fernandes | Setup das ferramentas e PR base de testes |
| Testes unitários (Services e Models)                | 10/09/2026      | Maria Eloisa     | Arquivos `.spec.js` das regras de negócio |
| Banco de teste e testes de integração               | 24/09/2026      | Maria Fernanda   | Suíte rodando com banco isolado           |
| Testes de endpoint (Supertest)                      | 08/10/2026      | Raissa Fernandes | Validação completa de rotas HTTP          |
| Mocks e testes E2E/Fluxo completo                   | 22/10/2026      | Todo o grupo     | Validação do fluxo de envio e filas       |
| Relatório final da formativa                        | 29/10/2026      | Todo o grupo     | Documentação técnica consolidada          |

> **Marco Fixo:** A suíte inteira de testes precisa estar totalmente funcional e rodando até **12/11/2026**, prazo final antes do início da avaliação somativa individual.

---

## 9. Papéis e responsabilidades

| Integrante           | Responsabilidade principal                                                                     |
| :------------------- | :--------------------------------------------------------------------------------------------- |
| **Raissa Fernandes** | Configuração da suíte, testes de middlewares, endpoints e validação de segurança JWT.          |
| **Maria Eloisa**     | Desenvolvimento de testes unitários para Services, Models e regras de negócio da fila.         |
| **Maria Fernanda**   | Configuração do ambiente isolado de banco de dados, mocks de serviços externos de e-mail/push. |
| **Isadora Moraes**   | Elaboração dos testes E2E, validação dos cenários de borda e documentação.                     |

### 9.1 Verificador da Suíte Integrada

**Raissa Fernandes** é a pessoa responsável por verificar se 100% da suíte de testes está passando antes de realizar cada commit/push e entrega.

---

## 10. Riscos do projeto de teste

| Risco                                                           | Probabilidade | Impacto | Como vamos lidar                                                                                                    |
| :-------------------------------------------------------------- | :-----------: | :-----: | :------------------------------------------------------------------------------------------------------------------ |
| Ausência ou falta de integrante da equipe                       |       2       |    4    | Realizar pareamentos de código (Pair Programming) e manter documentação clara das tarefas no repositório.           |
| Código legado do módulo sem refatoração para testabilidade      |       3       |    4    | Iniciar o processo com refatorações pontuais aplicando a técnica de injeção de dependência.                         |
| Dificuldade na configuração do ambiente isolado com filas/banco |       2       |    3    | Utilizar Mocks/Stubs leves em memória para não travar a evolução das suítes de testes unitários.                    |
| Cobertura de código abaixo da meta de 80% próximo do prazo      |       3       |    3    | Mapear as rotas não cobertas com ferramentas de relatórios (Ex: `jest --coverage`) e priorizar os trechos críticos. |

---

## Checklist de Encerramento

* [x] Todas as 10 seções preenchidas

* [x] Seção 2.3 (Fora do escopo) preenchida com motivos explicitados

* [x] Seção 3 com exatamente 12 itens específicos

* [x] Seção 4 com P e I avaliados separadamente e tabela ordenada por risco PxI decrescente

* [x] Seção 4.2 contendo os cinco itens de maior risco, em ordem de prioridade

* [x] Seção 6.2 contendo pelo menos um critério numérico

* [x] Seção 8 preenchida com datas alinhadas ao calendário da UC

* [x] Seção 9.1 com um responsável nominal

* [x] Arquivo salvo em `docs/plano-de-testes.md`
