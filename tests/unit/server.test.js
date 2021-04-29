const request = require('supertest');

let server;

describe('/', () => {
    beforeEach(() => { server = require('../../server') });
    afterEach( async () => { await server.close(); });
    
    describe('GET /', () => {
        it('should return "alive"', async() => {
            const res = await request(server).get('/');
            expect(res.status).toEqual(200);
            expect(res.text).toEqual('alive');
        });

    });
});