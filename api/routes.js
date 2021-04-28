'use strict'

module.exports = (app) => {

  //Shows the server is alive
  app.get('/', (req, res) => { res.status(200).send('alive'); });
  app.use('/v2', require('./v2'));

};