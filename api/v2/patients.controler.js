const axios = require('axios');
const config = require('config');
const defaultMessages = require('../../config/messages.json');


let externalAPI = config.get('external.api.patients');

/**
 * @name getPatient 
 * @description retrieve the patient data from an external service set by the enviroment configuration
 * @param {number} patientId the id of the patient
 * @returns an object with patient's data or an error
 */
 async function getPatient(patientId) {
    let response = await requestPatientsAPI(patientId);
    return response;
}

/**
 * @name requestPatientsAPI
 * @description uses Axios to make a request to the Patients external API
 * @param {number} patientId the patients ID
 * @returns {JSON} an object with patient's data or an error
 */
async function requestPatientsAPI(patientId, customAxiosConfig = null) {
    let axiosConfig;
    //customAxiosConfig is used to perform automated tests in the API
    if (customAxiosConfig) axiosConfig = customAxiosConfig
    else
        axiosConfig = {
            method: 'GET',
            baseURL: externalAPI.baseURL,
            url: externalAPI.path.replace(':id', patientId),
            headers: externalAPI.default_headers,
            timeout: externalAPI.timeout
        }

    let axiosResponse;
    let response = { status: 0, found: false, data: {} }
    try {
        axiosResponse = await axios(axiosConfig);
        response.status = 200;
        response.found = true;
        response.data = axiosResponse.data;
    } catch (error) {
        response = await formatPatientsApiErrors(error);
    } finally {
        return response;
    }
}


/**
 * @name formatPatientsApiErrors
 * @description Handles the formating of errors from calling the Patients API. Expected errors: 404 (not found); ECONNABORTED (axios timeout)
 * @param {JSON} error the Axios error when the Patients API was called
 * @returns {JSON} the object containing the information of the error
 */
async function formatPatientsApiErrors(error) {
    //start assuming on unexpected and unhandled error.
    let apiErrorResponse = {};
    apiErrorResponse.status = defaultMessages.api.v2.prescription.errors.unexpected_error.error.code;
    apiErrorResponse.found = false;
    apiErrorResponse.data = defaultMessages.api.v2.prescription.errors.unexpected_error;
    apiErrorResponse.data.original_error = error.message;

    //timeout handling
    if (error.code == 'ECONNABORTED') {
        apiErrorResponse.data = defaultMessages.api.v2.prescription.errors.patients_service_not_available;
        apiErrorResponse.status = defaultMessages.api.v2.prescription.errors.patients_service_not_available.error.code;
    } else if (error.response) {
        //status code 404 (not found) handling
        if (error.response.status == 404) {
            apiErrorResponse.data = defaultMessages.api.v2.prescription.errors.patient_not_found;
            apiErrorResponse.status = defaultMessages.api.v2.prescription.errors.patient_not_found.error.code;
        }
        else if (error.response.status == 429) {
            //too many requests
            apiErrorResponse.data = defaultMessages.api.v2.prescription.errors.patients_service_not_available;
            apiErrorResponse.status = defaultMessages.api.v2.prescription.errors.patients_service_not_available.error.code;
        }
    }
    return apiErrorResponse;
}

module.exports = {
    getPatient,
    requestPatientsAPI
}