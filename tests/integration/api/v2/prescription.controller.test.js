const request = require('supertest');
const mockPrescriptions = require('../../../mocks/prescriptions.mock.json')
const { Prescription } = require('../../../../db/models/prescription')
const defaultMessages = require('../../../../config/messages.json');

let server;

describe('/', () => {
    beforeEach(() => {
        server = require('../../../../server')
        jest.setTimeout(10000);
    });
    afterEach(async () => {
        //closes the server after each test
        await server.close();
    });

    //Invalid requests
    it(`should return an error with "${defaultMessages.api.v2.prescription.errors.physician_not_found.error.message}" due to physician id to be invalid. Sample: {${JSON.stringify(mockPrescriptions.invalid_prescriptions.physician_not_to_be_found)}}`, async () => {
        const res = await request(server).post('/v2/prescriptions').send(mockPrescriptions.invalid_prescriptions.physician_not_to_be_found).set('Accept', 'application/json');
        expect([
            defaultMessages.api.v2.prescription.errors.physician_not_found,
            defaultMessages.api.v2.prescription.errors.patients_service_not_available,
        ]).toContainEqual(res.body);
        //expect(res.body).toMatchObject(defaultMessages.api.v2.prescription.errors.physician_not_found);
    });

    it(`should return an error with "${defaultMessages.api.v2.prescription.errors.patient_not_found.error.message}" due to physician id to be invalid. Sample: {${JSON.stringify(mockPrescriptions.invalid_prescriptions.patient_not_to_be_found)}}`, async () => {
        const res = await request(server).post('/v2/prescriptions').send(mockPrescriptions.invalid_prescriptions.patient_not_to_be_found).set('Accept', 'application/json');
        expect([
            defaultMessages.api.v2.prescription.errors.patient_not_found,
            defaultMessages.api.v2.prescription.errors.patients_service_not_available,
        ]).toContainEqual(res.body);

        //expect(res.body).toMatchObject(defaultMessages.api.v2.prescription.errors.patient_not_found);
    });

    invalidPrescription = mockPrescriptions.invalid_prescriptions.no_text;
    it(`should return an error with "${defaultMessages.api.v2.prescription.errors.malformed_request.error.message}" due to missing text property. Sample: {${JSON.stringify(mockPrescriptions.invalid_prescriptions.no_text)}}`, async () => {
        const res = await request(server).post('/v2/prescriptions').send(mockPrescriptions.invalid_prescriptions.no_text).set('Accept', 'application/json');
        expect(res.body).toMatchObject(defaultMessages.api.v2.prescription.errors.malformed_request);
    });

    it(`should return an error with "${defaultMessages.api.v2.prescription.errors.malformed_request.error.message}" due to missing patient property. Sample: {${JSON.stringify(mockPrescriptions.invalid_prescriptions.no_patient)}}`, async () => {
        const res = await request(server).post('/v2/prescriptions').send(mockPrescriptions.invalid_prescriptions.no_patient).set('Accept', 'application/json');
        expect(res.body).toMatchObject(defaultMessages.api.v2.prescription.errors.malformed_request);
    });


    it(`should return an error with "${defaultMessages.api.v2.prescription.errors.malformed_request.error.message}" due to missing physician property. Sample: {${JSON.stringify(mockPrescriptions.invalid_prescriptions.no_physician)}}`, async () => {
        const res = await request(server).post('/v2/prescriptions').send(mockPrescriptions.invalid_prescriptions.no_physician).set('Accept', 'application/json');
        expect(res.body).toMatchObject(defaultMessages.api.v2.prescription.errors.malformed_request);
    });


    it(`should return an error with "${defaultMessages.api.v2.prescription.errors.malformed_request.error.message}" due to missing physician and patient property. Sample: {${JSON.stringify(mockPrescriptions.invalid_prescriptions.no_physician_no_patient)}}`, async () => {
        const res = await request(server).post('/v2/prescriptions').send(mockPrescriptions.invalid_prescriptions.no_physician_no_patient).set('Accept', 'application/json');
        expect(res.body).toMatchObject(defaultMessages.api.v2.prescription.errors.malformed_request);
    });

    it(`should return an error with "${defaultMessages.api.v2.prescription.errors.malformed_request.error.message}" due to missing physician and patient and no clinic property. Sample: {${JSON.stringify(mockPrescriptions.invalid_prescriptions.no_physician_no_patient_no_clinic)}}`, async () => {
        const res = await request(server).post('/v2/prescriptions').send(mockPrescriptions.invalid_prescriptions.no_physician_no_patient_no_clinic).set('Accept', 'application/json');
        expect(res.body).toMatchObject(defaultMessages.api.v2.prescription.errors.malformed_request);
    });


    //valid requests
    mockPrescriptions.valid_prescriptions.forEach(validPrescription => {
        it(`should insert a document in the Prescriptions collections if all params are provided. Sample: {${JSON.stringify(validPrescription)}}`, async () => {
            const res = await request(server).post('/v2/prescriptions').send(validPrescription).set('Accept', 'application/json');

            //mongoose returns the new document, containing the prescription data, if the insertion was sucessfull
            expect(res.body).toMatchObject(validPrescription);
            expect(res.status).toBe(200);
            //active the line bellow if you want to clear the MongoDB collection after this test
            //await Prescription.remove({});
        });
    });

    //single test
    /* let validPrescription = mockPrescriptions.valid_prescriptions[2];
    it(`should insert a document in the Prescriptions collections if all params are provided. Sample: {${JSON.stringify(validPrescription)}}`, async () => {
        const res = await request(server).post('/v2/prescriptions').send(validPrescription).set('Accept', 'application/json');
        
        expect(res.body).toMatchObject(validPrescription);
        expect(res.status).toBe(200);
        //await Prescription.remove({});
    }); */


});