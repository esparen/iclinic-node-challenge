const axios = require('axios');
const axiosRetry = require('axios-retry');
const config = require('config');
const defaultMessages = require('../../config/messages.json');
const { Cache } = require('./services/cache.service');

let externalAPI = config.get('external.api.physicians');
const physiciansCache = new Cache(externalAPI.cache_ttl);

/**
 * @name getPhysician 
 * @description retrieves the clinic data from the chache or an external service set by the enviroment configuration
 * @param {number} physicianId the id of the physician
 * @returns an object with physician's data or an error
 */
async function getPhysician(physicianId) {
    let response;
    const cacheKey = `getPhysician_${physicianId}`;
    let cacheResponse = await physiciansCache.get(cacheKey);
    if (cacheResponse) response = cacheResponse;
    else {
        response = await requestPhysiciansAPI(physicianId); 
        if (response.success) physiciansCache.set(cacheKey, response);
    }    
    return response;
}

/**
 * @name requestPhysiciansAPI
 * @description uses Axios to make a request to the Physicians external API
 * @param {number} physicianId the physicians ID
 * @returns {JSON} an object with physician's data or an error
 */
async function requestPhysiciansAPI(physicianId, customAxiosConfig = null) {
    let axiosConfig;
    //customAxiosConfig is used to perform automated tests in the API
    if (customAxiosConfig) axiosConfig = customAxiosConfig
    else
        axiosConfig = {
            method: 'GET',
            baseURL: externalAPI.baseURL,
            url: externalAPI.path.replace(':id', physicianId),
            headers: externalAPI.default_headers,
            timeout: externalAPI.timeout
        }

    let axiosResponse;
    let response = { status: 0, found: false, data: {} };

    //handling the request retries
    axiosRetry(axios, {
        retries: externalAPI.retries,
        retryDelay: (retryCount) => {
            return retryCount * 10; // time interval between retries
        },
        retryCondition: (error) => {
            //if (error.response) console.log(error.response.status, error.response.statusText );
            if (error) return true;
        }
    });
    try {
        axiosResponse = await axios(axiosConfig);
        response.status = 200;
        response.success = true;
        response.data = axiosResponse.data;
    } catch (error) {
        response = await formatPhysiciansApiErrors(error);
    } finally {
        return response;
    }
}


/**
 * @name formatPhysiciansApiErrors
 * @description Handles the formating of errors from calling the Physicians API. Expected errors: 404 (not found); ECONNABORTED (axios timeout)
 * @param {JSON} error the Axios error when the Physicians API was called
 * @returns {JSON} the object containing the information of the error
 */
async function formatPhysiciansApiErrors(error) {
    //start assuming on unexpected and unhandled error.
    let apiErrorResponse = {};
    apiErrorResponse.status = defaultMessages.api.v2.prescription.errors.unexpected_error.error.code;
    apiErrorResponse.success = false;
    apiErrorResponse.data = defaultMessages.api.v2.prescription.errors.unexpected_error;
    apiErrorResponse.data.original_error = 'Physicians service error' + error.message;

    //timeout handling
    if (error.code == 'ECONNABORTED') {
        apiErrorResponse.data = defaultMessages.api.v2.prescription.errors.physicians_service_not_available;
        apiErrorResponse.status = defaultMessages.api.v2.prescription.errors.physicians_service_not_available.error.code;
    } else if (error.response) {
        //status code 404 (not found) handling
        if (error.response.status == 404) {
            apiErrorResponse.data = defaultMessages.api.v2.prescription.errors.physician_not_found;
            apiErrorResponse.status = defaultMessages.api.v2.prescription.errors.physician_not_found.error.code;
        }
        else if (error.response.status == 429) {
            //too many requests
            apiErrorResponse.data = defaultMessages.api.v2.prescription.errors.physicians_service_not_available;
            apiErrorResponse.status = defaultMessages.api.v2.prescription.errors.physicians_service_not_available.error.code;
        }
    }
    return apiErrorResponse;
}

module.exports = {
    getPhysician,
    requestPhysiciansAPI
}