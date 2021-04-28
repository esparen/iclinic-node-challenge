const Joi = require('joi');
const mongoose = require('mongoose');

/**
 * @name prescriptionSchema
 * @description The Prescription's Collection Schema  
 */
const prescriptionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        minlength: 5
    },
    clinic: {
        id: { type: Number }
    },
    physician: {
        id: { type: Number, required: true }
    },
    patient: {
        id: { type: Number, required: true }
    }
})

/**
 * @name Prescription
 * @description the model class of the Prescription's collection Schema
 */
const Prescription = mongoose.model('Prescription', prescriptionSchema);


/**
 * @name validatePrescription
 * @description validates the input data of a Prescription using the mongoose schema of the collection
 * @param {JSON} prescription the JSON object with the input data for the collection
 * @returns {Object} contaning the result of the validation
 */
function validatePrescription(prescription) {
    const schema = {
        text: Joi.string().min(5).required(),
        clinic: { id: Joi.number() },
        physician: { id: Joi.number().required() },
        patient: { id: Joi.number().required() }
    };

    return Joi.validate(prescription, schema);
}

exports.Prescription = Prescription;
exports.validate = validatePrescription;