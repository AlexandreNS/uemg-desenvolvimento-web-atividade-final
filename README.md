# Avaliação 02

> A documentação da API criada nessa atividade pode ser conferida aqui [Avaliação 02-API](https://documenter.getpostman.com/view/12463861/UVR8o7hk).

A conexão do banco é realizada pelo `services/database.js` utilizando uma parametrizações vindas de um arquivo `.env`. É possível criar baseado no `.env.example`.

A partir de informações da tabela `login` localizadas na pasta de `schemas` é registrado pela função `routerModelBuilder(schema, limitDefault = 20, middlewares = {})`, incluída no arquivo `helpers/route.js`, operações de CRUD de acordo com as validações e informações passados no schema. As validações dos schemas foram realizadas utilizando o pacote [Joi](https://www.npmjs.com/package/joi).

Para impedir a criação ou atualização de usuários de mesmo login foi passado o `sameUserMiddleware` para as rotas de insert e update do builder de rotas.

Por fim foi configurado a rota `usuarios/realizarlogin` que somente faz a checagem do login e senha.

## Execução

Após a instalação das dependencias com `npm i` é possível rodar o projeto utilizando o nodemon com o seguinte comando:

```bash
nodemon --exec npm start
```
