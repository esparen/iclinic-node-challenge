const request = require('supertest');
const messages = require('../../../../config/messages.json')

let server;   

describe('api/v2/index', () => {
    beforeEach(() => { server = require('../../../../server') });
    afterEach(() => { server.close(); });
 
    describe('Route /v2', () => {
        it('Method GET should return invalid or incomplete request url', async () => {
            const res = await request(server).get('/v2');
            expect(res.status).toEqual(400);
            expect(JSON.parse(res.text)).toEqual(messages.api.v2.prescription.errors.invalid_or_incomplete_request_url);            
            expect(JSON.parse(res.text)).toMatchObject(messages.api.v2.prescription.errors.invalid_or_incomplete_request_url);            
        });

        it('Method POST should return invalid or incomplete request url', async () => {
            const res = await request(server).post('/v2');
            expect(res.status).toEqual(400);
            expect(JSON.parse(res.text)).toEqual(messages.api.v2.prescription.errors.invalid_or_incomplete_request_url);            
            expect(JSON.parse(res.text)).toMatchObject(messages.api.v2.prescription.errors.invalid_or_incomplete_request_url);            
        })

    } )

    describe('Route /v2/prescriptions', () => {
        it('Method GET should return invalid or incomplete request url', async () => {
            const res = await request(server).get('/v2/prescriptions');
            expect(res.status).toEqual(400);
            expect(JSON.parse(res.text)).toEqual(messages.api.v2.prescription.errors.invalid_or_incomplete_request_url);            
            expect(JSON.parse(res.text)).toMatchObject(messages.api.v2.prescription.errors.invalid_or_incomplete_request_url);            
        });

        it('Method POST should status code 200 and "alive"', async () => {
            const res = await request(server).post('/v2/prescriptions');
            expect(res.status).toEqual(200);
            expect(res.text).toEqual("alive");            
        })

    } )
})