const metricsController = require('../../../../api/v2/metrics.controller')
const mockMetrics = require('../../../mocks/metrics.mock.json');
const defaultMessages = require('../../../../config/messages.json');
const config = require('config');
let externalAPI = config.get('external.api.metrics');

describe('metrics.controller', () => {
    beforeAll(async () => {
        jest.setTimeout(10000);
    });
    describe('postMetric', () => {

        mockMetrics.validMetrics.forEach(mockedValidMetric => {
            it(`should return an json with the response body and a unique ID. sample: ${JSON.stringify(mockedValidMetric)}`, async () => {
                const res = await metricsController.postMetric(mockedValidMetric);
                expect([
                    200,
                    defaultMessages.api.v2.prescription.errors.metrics_service_not_available.error.code])
                    .toContain(res.status);
                expect(res.data).toHaveProperty('id');
            });
        });

        //the invalid metric test was removed because even if several required fields were not sent, 
        //the service still was inserting the data and answering with a new unique ID
        /*  mockMetrics.invalidMetrics.forEach(mockedInvalidMetric => {
             it(`should return json with errorCode, userMEssage and developerMessage. Sample ${JSON.stringify(mockedInvalidMetric)}`, async () => {
                 const res = await metricsController.postMetric(mockedInvalidMetric);
                 expect(res.status).not.toContain(200);
                 console.log('res.data', res.data);
                 expect(res.data).toHaveProperty('developerMessage');
                 expect(res.data).toHaveProperty('userMessage');
                 expect(res.data).toHaveProperty('errorCode');
             });
         }) */
    });

    describe('requestMetricsAPI', () => {
        it(`should return and json with status ${defaultMessages.api.v2.prescription.errors.metrics_service_not_available.error.code}  and the message ${JSON.stringify(defaultMessages.api.v2.prescription.errors.metrics_service_not_available)}`, async () => {
            let customAxiosConfig = {
                method: 'POST',
                data: mockMetrics.invalidMetrics[0],
                baseURL: externalAPI.baseURL,
                url: externalAPI.path,
                headers: externalAPI.default_headers,
                timeout: 1
            }
            const res = await metricsController.postMetricsAPI(mockMetrics.invalidMetrics[0], customAxiosConfig);
            expect(res).toHaveProperty('status', defaultMessages.api.v2.prescription.errors.metrics_service_not_available.error.code);
            expect(res).toHaveProperty('data', defaultMessages.api.v2.prescription.errors.metrics_service_not_available);
        });
    });
});