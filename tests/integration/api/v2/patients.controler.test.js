const patientsControler = require('../../../../api/v2/patients.controler')
const mockPatients = require('../../../mocks/patients.mock.json');
const defaultMessages = require('../../../../config/messages.json');
const config = require('config');
let externalAPI = config.get('external.api.patients');

describe('patients.controler', () => {
    describe('getPatient', () => {
        mockPatients.forEach(mockedPatient => {
            it(`should return an json with status 200. sample: ${JSON.stringify(mockedPatient)}`, async () => {
                const res = await patientsControler.getPatient(mockedPatient.id);
                expect(res).toHaveProperty('status', 200);
                expect(res.data).toHaveProperty('id', mockedPatient.id);
            });
        })

        it(`should return and json with status ${JSON.stringify(defaultMessages.api.v2.prescription.errors.patient_not_found.error.code)} and the message ${JSON.stringify(defaultMessages.api.v2.prescription.errors.patient_not_found)}`, async () => {
            const res = await patientsControler.getPatient(5646465);
            expect(res).toHaveProperty('status', defaultMessages.api.v2.prescription.errors.patient_not_found.error.code);
            expect(res).toHaveProperty('data', defaultMessages.api.v2.prescription.errors.patient_not_found);
        });
    });

    describe('requestPatientsAPI', () => {
        mockPatients.forEach(mockedPatient => {
            it(`should return an json with status 200. sample: ${JSON.stringify(mockedPatient)}`, async () => {
                const res = await patientsControler.requestPatientsAPI(mockedPatient.id);
                expect(res).toHaveProperty('status', 200);
                expect(res.data).toHaveProperty('id', mockedPatient.id);
            });
        })

        it(`should return and json with status ${JSON.stringify(defaultMessages.api.v2.prescription.errors.patient_not_found.error.code)} and the message ${JSON.stringify(defaultMessages.api.v2.prescription.errors.patient_not_found)}`, async () => {
            const res = await patientsControler.requestPatientsAPI(5646465);
            expect(res).toHaveProperty('status', defaultMessages.api.v2.prescription.errors.patient_not_found.error.code);
            expect(res).toHaveProperty('data', defaultMessages.api.v2.prescription.errors.patient_not_found);
        });

        it(`should return and json with status ${defaultMessages.api.v2.prescription.errors.patients_service_not_available.error.code}  and the message ${JSON.stringify(defaultMessages.api.v2.prescription.errors.patients_service_not_available)}`, async () => {
            let customAxiosConfig = {
                method: 'GET',
                baseURL: externalAPI.baseURL,
                url: externalAPI.path.replace(':id', 1),
                headers: externalAPI.default_headers,
                timeout: 1
            }
            const res = await patientsControler.requestPatientsAPI(5646465, customAxiosConfig);
            expect(res).toHaveProperty('status', defaultMessages.api.v2.prescription.errors.patients_service_not_available.error.code);
            expect(res).toHaveProperty('data', defaultMessages.api.v2.prescription.errors.patients_service_not_available);
        });
    });
});