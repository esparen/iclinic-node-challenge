

# Starting up

### MongoDB

 - Garantir que o MongoDB esteja instalado (https://docs.mongodb.com/manual/installation/).
 - Garantir que a string de conexão apropriada esteja no arquivo /config/default.json no atributo "db" 


### API

- Executar o comando npm run start na raiz da API 
- Por padrão, o servidor irá iniciar na porta definida em `process.env.PORT` ou **3000**.


### Testes de integração:
+ Importar os arquivos dentro de tests\mocks para o mongoDB utilizando os seguintes comandos:

  + `mongoimport --collection=physicians --db=prescriptions_test --file=tests\mocks\physicians.mock.json`

  + `mongoimport --collection=clinics --db=prescriptions_test --file=tests\mocks\clinics.mock.json`

  + `mongoimport --collection=patients --db=prescriptions_test --file=tests\mocks\patients.mock.json`
 

___
Atenciosamente,

Ederson Sparenberger.
