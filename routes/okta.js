const express = require('express');
const router = express.Router();
const configuration = require('../util/config');
const createApplicant = require('../services/onfido');
const { updateApplicantId } = require('../services/okta');

router.get('/applicant', (req, res) => {
  const authHeader = req.headers['authorization'];
  if (authHeader !== configuration.oktaEventKey) {
    res.status(403).json({ error: 'Not Authorized'});
  }
  const returnValue = {
    "verification": req.headers['x-okta-verification-challenge']
  };
  res.json(returnValue);
});

router.post('/applicant', (req, res) => {
  const authHeader = req.headers['authorization'];
  if (authHeader !== configuration.oktaEventKey) {
    res.status(403).json({ error: 'Not Authorized'});
  }
  var newUser = req.body.data.events[0]['target'][0];
  res.sendStatus(200);
  createApplicant(newUser.firstName, newUser.lastName, newUser.email).then((response) => {
    const applicantId = response.id;
    updateApplicantId(newUser.id, applicantId);
  })
});

module.exports = router;