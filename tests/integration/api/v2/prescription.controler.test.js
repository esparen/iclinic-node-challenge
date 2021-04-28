const request = require('supertest');
const mockPrescriptions = require('../../../mocks/prescriptions.mock.json')
const { Prescription } = require('../../../../db/models/prescription')


let server;

describe('/', () => {
    beforeEach(() => { server = require('../../../../server') });
    afterEach(async () => { 
        //closes the server after each test
        await server.close(); 
    });
    
    mockPrescriptions.valid_prescriptions.forEach(validPrescription => {
        it(`should insert a document in the Prescriptions collections if all params are provided. Sample: {${JSON.stringify(validPrescription)}}`, async () => {
            const res = await request(server).post('/v2/prescriptions').send( validPrescription ).set('Accept', 'application/json');
            expect(res.status).toBe(200);
            //mongoose returns the new document, containing the prescription data, if the insertion was sucessfull
            expect(res.body).toMatchObject(validPrescription);
            await Prescription.remove({});
        });
        
    });

    for (const key in mockPrescriptions.invalid_prescriptions) {
        if (mockPrescriptions.invalid_prescriptions.hasOwnProperty(key)) {
            const invalidPrescription = mockPrescriptions.invalid_prescriptions[key];
            it(`should return an error with ${key}. Sample: {${JSON.stringify(invalidPrescription)}}`, async () => {
                const res = await request(server).post('/v2/prescriptions').send( invalidPrescription ).set('Accept', 'application/json');
                expect(res.body).toHaveProperty('error');
                //mongoose returns the new document, containing the prescription data, if the insertion was sucessfull
            });
        }
    }  
});
