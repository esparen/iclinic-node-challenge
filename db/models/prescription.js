//const Joi = require('joi');
const mongoose = require('mongoose');

const Prescription = mongoose.model('Prescription', new mongoose.Schema({
    text: {
        type: String,
        required: true,
        minlength: 5
    },
    clinic: {
        id: { type: Number, required: true }
    },
    physician: {
        id: { type: Number, required: true }
    },
    patient: {
        id: { type: Number, required: true }
    }
}));

/* function validateCustomer(customer) {
    const schema = {
        text: Joi.string().min(5).required(),
        "clinic.id" : Joi.string().min(5).max(50).required(),
        isGold: Joi.boolean()
    };

    return Joi.validate(customer, schema);
} */

exports.Prescription = Prescription;
//exports.validate = validateCustomer;