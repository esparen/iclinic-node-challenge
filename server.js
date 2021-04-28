const config = require('config');
const http = require('http');



const app = require('./app');
const server = http.createServer(app);

const port = process.env.PORT || config.get('port');
const host = process.env.HOST || config.get('host');
server.listen(port, host, () => {
    console.info(`listening on port ${port}...`);
});

module.exports = server;