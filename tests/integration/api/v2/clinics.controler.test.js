const clinicsControler = require('../../../../api/v2/clinics.controler')
const mockClinics = require('../../../mocks/clinics.mock.json');
const defaultMessages = require('../../../../config/messages.json');
const config = require('config');
let externalAPI = config.get('external.api.clinics');

describe('clinics.controler', () => {
    beforeAll(async () => {
        jest.setTimeout(10000);
    });
    describe('getClinic', () => {
        mockClinics.forEach(mockedClinic => {
            it(`should return an json with status 200. sample: ${JSON.stringify(mockedClinic)}`, async () => {
                const res = await clinicsControler.getClinic(mockedClinic.id);
                expect([
                    200,
                    defaultMessages.api.v2.prescription.errors.clinics_service_not_available.error.code
                ]).toContain(res.status);
                expect(res.data).toHaveProperty('id', mockedClinic.id);
            });
        })

        it(`should return an empty message and a json with status ${defaultMessages.api.v2.prescription.errors.clinic_not_found.error.code} (not found)  or ${defaultMessages.api.v2.prescription.errors.clinics_service_not_available.error.code} (unavailable)`, async () => {
            const res = await clinicsControler.getClinic(5646465);
            expect([
                defaultMessages.api.v2.prescription.errors.clinic_not_found.error.code,
                defaultMessages.api.v2.prescription.errors.clinics_service_not_available.error.code
            ]).toContain(res.status);
            expect(res).toHaveProperty('data', {});
        });
    });

    describe('requestClinicsAPI', () => {
        it(`should return an json with status 200. sample: ${JSON.stringify(mockClinics[0])}`, async () => {
            const res = await clinicsControler.requestClinicsAPI(mockClinics[0].id);
            expect([
                200,
                defaultMessages.api.v2.prescription.errors.clinics_service_not_available.error.code
            ]).toContain(res.status);
            expect(res.data).toHaveProperty('id', mockClinics[0].id);
        });

        it(`should return an empty message and a json with status ${defaultMessages.api.v2.prescription.errors.clinic_not_found.error.code} (not found)  or ${defaultMessages.api.v2.prescription.errors.clinics_service_not_available.error.code} (unavailable)`, async () => {
            const res = await clinicsControler.requestClinicsAPI(5646465);
            expect([
                defaultMessages.api.v2.prescription.errors.clinic_not_found.error.code,
                defaultMessages.api.v2.prescription.errors.clinics_service_not_available.error.code]).toContain(res.status);
            expect(res).toHaveProperty('data', {});
        });

        it(`should return and json with status ${defaultMessages.api.v2.prescription.errors.clinics_service_not_available.error.code} and and empty message`, async () => {
            let customAxiosConfig = {
                method: 'GET',
                baseURL: externalAPI.baseURL,
                url: externalAPI.path.replace(':id', 1),
                headers: externalAPI.default_headers,
                timeout: 1
            }
            const res = await clinicsControler.requestClinicsAPI(5646465, customAxiosConfig);
            expect(res).toHaveProperty('status', defaultMessages.api.v2.prescription.errors.clinics_service_not_available.error.code);
            expect(res).toHaveProperty('data', {});
        });
    });
});