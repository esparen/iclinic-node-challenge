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
            return retryCount * 20; // time interval between retries
        },
        retryCondition: (error) => {
            if (error) return true;
        }
    });
    try {
        axiosResponse = await axios(axiosConfig);
        response.status = 200;
        response.success = true;
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
    apiErrorResponse.success = false;
    apiErrorResponse.data = defaultMessages.api.v2.prescription.errors.unexpected_error;
    apiErrorResponse.data.original_error = 'Metrics service error:' + error.message;
    apiErrorResponse.data.error_raw = error;

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


/**
 * @name formatMetricBody
 * @description Composes the metrics service request body.
 * @param {JSON} physicianData Data from the physician external service
 * @param {JSON} patientData Data from the patient external service
 * @param {JSON} clinicData Data from the clinic external service
 * @returns {JSON} a valid body for the metrics API
 */
async function formatMetricBody(physicianData, patientData, clinicData) {
    let response = {};
    response = {
        clinic_id: Number(clinicData.id),
        physician_id: Number(physicianData.id),
        physician_name: physicianData.name,
        physician_crm: physicianData.crm,
        patient_id: Number(patientData.id),
        patient_name: patientData.name,
        patient_email: patientData.email,
        patient_phone: patientData.phone
    };
    if (clinicData.hasOwnProperty('name')) {
        response = {
            clinic_name: clinicData.name,
            ...response
        };
    }
    return response
}

module.exports = {
    postMetric,
    postMetricsAPI,
    formatMetricBody
}