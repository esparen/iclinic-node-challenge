const physiciansControler = require('../../../../api/v2/physicians.controler')
const mockPhysicians = require('../../../mocks/physicians.mock.json');
const defaultMessages = require('../../../../config/messages.json');
const config = require('config');
let externalAPI = config.get('external.api.physicians');

describe('physicians.controler', () => {    
    describe('getPhysician', () => {
        it('should return an json with status 200', async () => {
            const res = await physiciansControler.getPhysician(1);
            expect(res).toHaveProperty('status',200);
        });

        it(`should return and json with status 404 and the message ${JSON.stringify(defaultMessages.api.v2.prescription.errors.physician_not_found)}`, async () => {
            const res = await physiciansControler.getPhysician(5646465);
            expect(res).toHaveProperty('status', 404);
            expect(res).toHaveProperty('data', defaultMessages.api.v2.prescription.errors.physician_not_found); 
        });
    });

    describe('requestPhysiciansAPI', () => {
        it('should return an json with status 200', async () => {
            const res = await physiciansControler.requestPhysiciansAPI(1);
            expect(res).toHaveProperty('status',200);
        });

        it(`should return and json with status 404 and the message ${JSON.stringify(defaultMessages.api.v2.prescription.errors.physician_not_found)}`, async () => {
            const res = await physiciansControler.requestPhysiciansAPI(5646465);
            expect(res).toHaveProperty('status', 404);
            expect(res).toHaveProperty('data', defaultMessages.api.v2.prescription.errors.physician_not_found); 
        });

        it(`should return and json with status ${defaultMessages.api.v2.prescription.errors.physicians_service_not_available.error.code}  and the message ${JSON.stringify(defaultMessages.api.v2.prescription.errors.physicians_service_not_available)}`, async () => {
            let customAxiosConfig = {
                method: 'GET',
                baseURL: externalAPI.baseURL,
                url: externalAPI.path.replace(':id', 1),
                headers: externalAPI.default_headers,
                timeout: 1
            }
            const res = await physiciansControler.requestPhysiciansAPI(5646465, customAxiosConfig);
            expect(res).toHaveProperty('status', defaultMessages.api.v2.prescription.errors.physicians_service_not_available.error.code);
            expect(res).toHaveProperty('data', defaultMessages.api.v2.prescription.errors.physicians_service_not_available); 
        });
    });
});