# Prescriptions API
## _An RESTful API for the iClinic Challenge_

This is the repository for the iClinic challenge based on https://github.com/iclinic/iclinic-node-challenge.


# How to use

### Node
 - Make sure you have Node.js installed (this API was built in node `v10.16.2`)

### MongoDB

 - Ensure that MongoDB is installed  (https://docs.mongodb.com/manual/installation/).
 - Ensure that appropriate connection string is on propriety "db" of the files the file /config/default.json and /config/test.json


### API

+ Install the node packages by running this command: `npm i` 
+ To start the API :
    - Run the command `npm run start:watch to run` on project root folder ( uses [nodemon] to run, recommended) 
    - or `npm run start:watch` on project root folder to use vanilla Node.
- By default the API will run on the port difined in `process.env.PORT` or `3000`.
- The url for the POST method is `HOST:PORT/v2/prescriptions` (i.e: `localhost:3000/v2/prescriptions`)


### Automated Tests:
+ The automated tests were written using jest and supertest. To run them: :
  - Run command `npm run test` on the project root folder


### JSDocs
 - The package [docnator] was used to assemble the JSDocs in the `\docs` folder

___
Atenciosamente,

Ederson Sparenberger.


[//]: #

   [nodemon]: <https://www.npmjs.com/package/nodemon>
   [docnator]: <https://github.com/agrotis-io/docnator>
