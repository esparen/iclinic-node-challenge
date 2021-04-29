const axios = require('axios');
const axiosRetry = require('axios-retry');
const config = require('config');
const defaultMessages = require('../../config/messages.json');


let externalAPI = config.get('external.api.metrics');

/**
 * @name postMetric 
 * @description requests an insertion on the metric external service, set on enviroment configuration
 * @param {JSON} metricBody the id of the metric
 * @returns {JSON} an object with metric service response or an error
 */
async function postMetric(metricBody) {
    let response = await postMetricsAPI(metricBody);
    return response;
}

/**
 * @name postMetricsAPI
 * @description uses Axios to make a POST request to the Metrics external API
 * @param {JSON} metricBody the metrics request body
 * @returns {JSON} an object with metric's response or an error
 */
async function postMetricsAPI(metricBody, customAxiosConfig = null) {
    let axiosConfig;
    //customAxiosConfig is used to perform automated tests in the API
    if (customAxiosConfig) axiosConfig = customAxiosConfig
    else
        axiosConfig = {
            method: 'POST',
            baseURL: externalAPI.baseURL,
            url: externalAPI.path,
            data: metricBody,
            headers: externalAPI.default_headers,
            timeout: externalAPI.timeout
        }

    let axiosResponse;
    let response = { status: 0, found: false, data: {} }

    axiosRetry(axios, {
        retries: externalAPI.retries,
        retryDelay: (retryCount) => {
            return retryCount * 10; // time interval between retries
        },
        retryCondition: (error) => {
            if (error) return true;
        }
    });
    try {
        axiosResponse = await axios(axiosConfig);
        response.status = 200;
        response.found = true;
        response.data = axiosResponse.data;
    } catch (error) {
        response = await formatMetricsApiErrors(error);
    } finally {
        return response;
    }
}


/**
 * @name formatMetricsApiErrors
 * @description Handles the formating of errors from calling the Metrics API. Expected errors: 404 (not found); 429 (too many requests);  ECONNABORTED (axios timeout)
 * @param {JSON} error the Axios error when the Metrics API was called
 * @returns {JSON} the object containing the information of the error
 */
async function formatMetricsApiErrors(error) {
    //start assuming on unexpected and unhandled error.
    let apiErrorResponse = {};
    apiErrorResponse.status = defaultMessages.api.v2.prescription.errors.unexpected_error.error.code;
    apiErrorResponse.found = false;
    apiErrorResponse.data = defaultMessages.api.v2.prescription.errors.unexpected_error;
    apiErrorResponse.data.original_error = error.message;

    //timeout handling
    if (error.code == 'ECONNABORTED') {
        apiErrorResponse.data = defaultMessages.api.v2.prescription.errors.metrics_service_not_available;
        apiErrorResponse.status = defaultMessages.api.v2.prescription.errors.metrics_service_not_available.error.code;
    } else if (error.response) {
        //status code 404 (not found) handling
        if (error.response.status == 404) {
            apiErrorResponse.data = defaultMessages.api.v2.prescription.errors.metric_not_found;
            apiErrorResponse.status = defaultMessages.api.v2.prescription.errors.metric_not_found.error.code;
        }
        else if (error.response.status == 429) {
            //too many requests
            apiErrorResponse.data = defaultMessages.api.v2.prescription.errors.metrics_service_not_available;
            apiErrorResponse.status = defaultMessages.api.v2.prescription.errors.metrics_service_not_available.error.code;
        }
    }
    return apiErrorResponse;
}

module.exports = {
    postMetric,
    postMetricsAPI
}