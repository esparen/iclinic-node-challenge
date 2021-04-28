const axios = require('axios');
const config = require('config');
const defaultMessages = require('../../config/messages.json');


let externalAPI = config.get('external.api.clinics');

/**
 * @name getClinic 
 * @description retrieve the clinic data from an external service set by the enviroment configuration
 * @param {number} clinicId the id of the clinic
 * @returns an object with clinic's data or an error
 */
 async function getClinic(clinicId) {
    let response = await requestClinicsAPI(clinicId);
    return response;
}

/**
 * @name requestClinicAPI
 * @description uses Axios to make a request to the Clinic external API
 * @param {number} clinicId the clinic ID
 * @returns {JSON} an object with clinic's data or an error
 */
async function requestClinicsAPI(clinicId, customAxiosConfig = null) {
    let axiosConfig;
    //customAxiosConfig is used to perform automated tests in the API
    if (customAxiosConfig) axiosConfig = customAxiosConfig
    else
        axiosConfig = {
            method: 'GET',
            baseURL: externalAPI.baseURL,
            url: externalAPI.path.replace(':id', clinicId),
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
        response = await formatClinicApiErrors(error);
    } finally {
        return response;
    }
}


/**
 * @name formatClinicApiErrors
 * @description Handles the formating of errors from calling the Clinic API. Expected errors: 404 (not found); ECONNABORTED (axios timeout)
 * @param {JSON} error the Axios error when the Clinic API was called
 * @returns {JSON} the object containing the information of the error
 */
async function formatClinicApiErrors(error) {
    //start assuming on unexpected and unhandled error.
    let apiErrorResponse = {};
    apiErrorResponse.status = defaultMessages.api.v2.prescription.errors.unexpected_error.error.code;
    apiErrorResponse.found = false;
    apiErrorResponse.data = defaultMessages.api.v2.prescription.errors.unexpected_error;
    apiErrorResponse.data.original_error = error.message;

    //timeout handling
    if (error.code == 'ECONNABORTED') {
        //clinics don't have error handling for service not available (yet). We pass empty data, but with the proper internal status code
        apiErrorResponse.data = {}
        apiErrorResponse.status = defaultMessages.api.v2.prescription.errors.clinics_service_not_available.error.code;
    } else if (error.response) {
        apiErrorResponse.data = {}
        //clinics don't have error handling for 404 - not found (yet). We pass empty data, but with the proper internal status code
        if (error.response.status == 404) {
            apiErrorResponse.status = defaultMessages.api.v2.prescription.errors.clinic_not_found.error.code;
        } else if (error.response.status == 429) {
            //too many requests
            apiErrorResponse.status = defaultMessages.api.v2.prescription.errors.clinics_service_not_available.error.code;
        }
        
        
        
    }
    return apiErrorResponse;
}

module.exports = {
    getClinic,
    requestClinicsAPI
}