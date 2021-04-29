const axios = require('axios');
const axiosRetry  = require('axios-retry');
const config = require('config');
const defaultMessages = require('../../config/messages.json');
const { Cache } = require('./services/cache.service');

let externalAPI = config.get('external.api.clinics');
const clinicsCache = new Cache(externalAPI.cache_ttl);

/**
 * @name getClinic 
 * @description retrieves the clinic data from the chache or an external service set by the enviroment configuration
 * @param {number} clinicId the id of the clinic
 * @returns an object with clinic's data or an error
 */
 async function getClinic(clinicId) {
    let response;
    const cacheKey = `getClinic_${clinicId}`;
    let cacheResponse = await clinicsCache.get(cacheKey);
    if (cacheResponse) response = cacheResponse;
    else {
        response = await requestClinicsAPI(clinicId);
        if (response.success) clinicsCache.set(cacheKey, response);
    }
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
    apiErrorResponse.success = false;
    apiErrorResponse.data = defaultMessages.api.v2.prescription.errors.unexpected_error;
    apiErrorResponse.data.original_error = "Clinics service error:" + error.message;

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