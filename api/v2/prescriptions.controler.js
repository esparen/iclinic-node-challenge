const {Prescription, validate} = require('../../db/models/prescription')


/**
 * @name handleNewPrescription
 * @description handles the proccess and validations of an incoming prescription
 * @param {Object} req 
 * @param {Object} res 
 */
exports.handleNewPrescription = async (req, res) => {
    const { text, clinic, patient, physician } = req.body;
    
    let prescriptionValidation = await validate({ text, clinic, patient, physician });    
    if (prescriptionValidation.error) {
        res.status(400).send({error: prescriptionValidation.error.details[0].message});
    }
    else {
        let response = await insertPrescription(text, clinic, patient, physician);
        res.status(200).send(response);
    }
}

/**
 * @name insertPrescription
 * @description Inserts a prescription in the MongoDB collection Prescriptions
 * @param {String} text 
 * @param {JSON} [clinic=null] Object containing the id of the clinic
 * @param {JSON} patient Object containing the id of the patient
 * @param {JSON} physician Object containing the id of the physician
 * @returns the response from mongoose after trying to insert the document in the collection
 */
async function insertPrescription(text, clinic, patient, physician) {
    const newPrescription = new Prescription({ text, clinic, patient, physician });    
    const response = await newPrescription.save();
    return response;
}