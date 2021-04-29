const {Prescription, validate} = require('../../db/models/prescription');
const defaultMessages = require('../../config/messages.json');
const physiciansController = require('./physicians.controller');
const patientsController = require('./patients.controller');
const clinicsController = require('./clinics.controller');
const metricsController = require('./metrics.controller');


/**
 * @name handleNewPrescription
 * @description Handles the proccess and validations of an incoming prescription. 
 * @param {Object} req the request object
 * @param {Object} res the respone object
 */
exports.handleNewPrescription = async (req, res) => {
    const { text, clinic, patient, physician } = req.body;
    let prescriptionValidation = await validate({ text, clinic, patient, physician });    
    if (prescriptionValidation.error) return res.status(400).send( defaultMessages.api.v2.prescription.errors.malformed_request )  //{error: prescriptionValidation.error.details[0].message});
    else {
        
        let physicianData = await physiciansController.getPhysician(physician.id);
        if (!physicianData.success) return res.status(400).send( physicianData.data );

        let patientData = await patientsController.getPatient(patient.id);
        if (!patientData.success) return res.status(400).send( patientData.data )

        //If clinics data is not provided or the clinics service don't answer, 
        //we continue nonetheless only with the clinic id provided by the POST request
        let clinicData = await clinicsController.getClinic(clinic.id);
        if (!clinicData.success) clinicData.data = {id: clinic.id}

        let metricBody = await metricsController.formatMetricBody(physicianData.data, patientData.data, clinicData.data)
        //TODO: consider to change the postMetric to not await
        let metricResponse = await metricsController.postMetric(metricBody);

        if (metricResponse.success) {        
            let response = await insertPrescription(text, clinic, patient, physician);
            res.status(200).send(response);
        } else {
            return res.status(200).send(metricResponse.data);
        }
    }
}

/**
 * @name insertPrescription
 * @description Inserts a prescription in the MongoDB collection Prescriptions
 * @param {String} text 
 * @param {JSON} clinic Object containing the id of the clinic
 * @param {JSON} patient Object containing the id of the patient
 * @param {JSON} physician Object containing the id of the physician
 * @returns the response from mongoose after trying to insert the document in the collection
 */
async function insertPrescription(text, clinic, patient, physician) {
    const newPrescription = new Prescription({ text, clinic, patient, physician });    
    const response = await newPrescription.save();
    return response;
}

