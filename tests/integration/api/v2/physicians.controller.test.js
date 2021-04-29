const physiciansController = require('../../../../api/v2/physicians.controller')
const mockPhysicians = require('../../../mocks/physicians.mock.json');
const defaultMessages = require('../../../../config/messages.json');
const config = require('config');
let externalAPI = config.get('external.api.physicians');

describe('physicians.controller', () => {
    beforeAll(async () => {
        jest.setTimeout(10000);
    });
    describe('getPhysician', () => {
        mockPhysicians.forEach(mockedPhysician => {
            it(`should return an json with status 200 or ${defaultMessages.api.v2.prescription.errors.physicians_service_not_available.error.code} (unavailable). Sample: ${JSON.stringify(mockedPhysician)}`, async () => {
                const res = await physiciansController.getPhysician(mockedPhysician.id);
                expect([
                    200,
                    defaultMessages.api.v2.prescription.errors.physicians_service_not_available.error.code])
                    .toContain(res.status);
            });
        })

        it(`should return an empty message and a json with status ${defaultMessages.api.v2.prescription.errors.physician_not_found.error.code} (not found)  or ${defaultMessages.api.v2.prescription.errors.physicians_service_not_available.error.code} (unavailable)`, async () => {
            const res = await physiciansController.getPhysician(5646465);
            expect([
                defaultMessages.api.v2.prescription.errors.physician_not_found.error.code,
                defaultMessages.api.v2.prescription.errors.physicians_service_not_available.error.code
            ]).toContain(res.status);
            expect(res).toHaveProperty('data', defaultMessages.api.v2.prescription.errors.physician_not_found);
        });
    });

    describe('requestPhysiciansAPI', () => {
        it(`should return an json with status 200 or ${defaultMessages.api.v2.prescription.errors.physicians_service_not_available.error.code} (unavailable). sample: ${JSON.stringify(mockPhysicians[0])}`, async () => {
            const res = await physiciansController.requestPhysiciansAPI(mockPhysicians[0].id);
            expect([
                200,
                defaultMessages.api.v2.prescription.errors.physicians_service_not_available.error.code])
                .toContain(res.status);
        });

        it(`should return an empty message and a json with status ${defaultMessages.api.v2.prescription.errors.physician_not_found.error.code} (not found)  or ${defaultMessages.api.v2.prescription.errors.physicians_service_not_available.error.code} (unavailable)`, async () => {
            const res = await physiciansController.requestPhysiciansAPI(5646465);
            expect([
                defaultMessages.api.v2.prescription.errors.physician_not_found.error.code,
                defaultMessages.api.v2.prescription.errors.physicians_service_not_available.error.code
            ]).toContain(res.status);
            expect([
                defaultMessages.api.v2.prescription.errors.physician_not_found,
                defaultMessages.api.v2.prescription.errors.physicians_service_not_available
            ]).toContain(res.data);
        });

        it(`should return and json with status ${defaultMessages.api.v2.prescription.errors.physicians_service_not_available.error.code}  and the message ${JSON.stringify(defaultMessages.api.v2.prescription.errors.physicians_service_not_available)}`, async () => {
            let customAxiosConfig = {
                method: 'GET',
                baseURL: externalAPI.baseURL,
                url: externalAPI.path.replace(':id', 1),
                headers: externalAPI.default_headers,
                timeout: 1
            }
            const res = await physiciansController.requestPhysiciansAPI(5646465, customAxiosConfig);
            expect(res).toHaveProperty('status', defaultMessages.api.v2.prescription.errors.physicians_service_not_available.error.code);
            expect(res).toHaveProperty('data', defaultMessages.api.v2.prescription.errors.physicians_service_not_available);
        });
    });
});