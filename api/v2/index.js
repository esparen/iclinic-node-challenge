'use strict'

const messages = require('../../config/messages.json')
const router = require('express').Router();
const prescriptionsControler = require('./prescriptions.controler');

//valid routes
router.post('/prescriptions', prescriptionsControler.handleNewPrescription);

//invalid routes
router.get('/prescriptions', (req, res) => { res.status(400).send(messages.api.v2.prescription.errors.invalid_or_incomplete_request_url) }); 
router.get('/', (req, res) => { res.status(400).send(messages.api.v2.prescription.errors.invalid_or_incomplete_request_url) }); 
router.post('/', (req, res) => { res.status(400).send(messages.api.v2.prescription.errors.invalid_or_incomplete_request_url) }); 

module.exports = router;