const patientsController = require('../../../../api/v2/patients.controller')
const mockPatients = require('../../../mocks/patients.mock.json');
const defaultMessages = require('../../../../config/messages.json');
const config = require('config');
let externalAPI = config.get('external.api.patients');

describe('patients.controller', () => {
    beforeAll(async () => {
        jest.setTimeout(10000);
    });
    describe('getPatient', () => {
        mockPatients.forEach(mockedPatient => {
            it(`should return an json with status 200. sample: ${JSON.stringify(mockedPatient)}`, async () => {
                const res = await patientsController.getPatient(mockedPatient.id);
                expect([
                    200,
                    defaultMessages.api.v2.prescription.errors.patients_service_not_available.error.code])
                    .toContain(res.status);
            });
        })

        it(`should return an empty message and a json with status ${defaultMessages.api.v2.prescription.errors.patient_not_found.error.code} (not found)  or ${defaultMessages.api.v2.prescription.errors.patients_service_not_available.error.code} (unavailable)`, async () => {
            const res = await patientsController.getPatient(5646465);
            expect([
                defaultMessages.api.v2.prescription.errors.patient_not_found.error.code,
                defaultMessages.api.v2.prescription.errors.patients_service_not_available.error.code
            ]).toContain(res.status);
            expect([
                defaultMessages.api.v2.prescription.errors.patient_not_found,
                defaultMessages.api.v2.prescription.errors.patients_service_not_available
            ]).toContainEqual(res.data);
        });
    });

    describe('requestPatientsAPI', () => {
        it(`should return an json with status 200 and either the response for service unavaliable or a response with the id property . sample: ${JSON.stringify(mockPatients[0])}`, async () => {
            const res = await patientsController.requestPatientsAPI(mockPatients[0].id);
            expect([
                200,
                defaultMessages.api.v2.prescription.errors.patients_service_not_available.error.code])
                .toContain(res.status);
        });

        it(`should return an empty message and a json with status ${defaultMessages.api.v2.prescription.errors.patient_not_found.error.code} (not found)  or ${defaultMessages.api.v2.prescription.errors.patients_service_not_available.error.code} (unavailable)`, async () => {
            const res = await patientsController.requestPatientsAPI(5646465);
            expect([
                defaultMessages.api.v2.prescription.errors.patient_not_found.error.code,
                defaultMessages.api.v2.prescription.errors.patients_service_not_available.error.code])
                .toContain(res.status);
            expect([
                defaultMessages.api.v2.prescription.errors.patient_not_found,
                defaultMessages.api.v2.prescription.errors.patients_service_not_available
            ]).toContainEqual(res.data);
        });

        it(`should return and json with status ${defaultMessages.api.v2.prescription.errors.patients_service_not_available.error.code}  and the message ${JSON.stringify(defaultMessages.api.v2.prescription.errors.patients_service_not_available)}`, async () => {
            let customAxiosConfig = {
                method: 'GET',
                baseURL: externalAPI.baseURL,
                url: externalAPI.path.replace(':id', 1),
                headers: externalAPI.default_headers,
                timeout: 1
            }
            const res = await patientsController.requestPatientsAPI(5646465, customAxiosConfig);
            expect(res).toHaveProperty('status', defaultMessages.api.v2.prescription.errors.patients_service_not_available.error.code);
            expect(res).toHaveProperty('data', defaultMessages.api.v2.prescription.errors.patients_service_not_available);
        });
    });
});