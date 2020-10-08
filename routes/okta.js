const express = require('express');
const router = express.Router();
const configuration = require('../util/config');
const { createApplicant } = require('../services/onfido');
const { updateApplicantId } = require('../services/okta');

router.get('/applicant', (req, res) => {
  const authHeader = req.headers['authorization'];
  console.log(`okta event hook checkin with authHeader: ${authHeader}`);
  if (authHeader !== configuration.oktaEventKey) {
    console.log('auth header does not match configured oktaEventKey');
    res.status(403).json({ error: 'Not Authorized'});
  }
  const returnValue = {
    "verification": req.headers['x-okta-verification-challenge']
  };
  console.log(`returning verification header value: ${returnValue}`);
  res.json(returnValue);
});

router.post('/applicant', (req, res) => {
  const authHeader = req.headers['authorization'];
  console.log(`okta event hook request with authHeader: ${authHeader}`);
  if (authHeader !== configuration.oktaEventKey) {
    console.log('auth header does not match configured oktaEventKey');
    res.status(403).json({ error: 'Not Authorized'});
  }
  console.log(`okta event body: ${req.body}`)
  var newUser = req.body.data.events[0]['target'][0];
  console.log(`okta event create user: ${newUser}`);
  res.sendStatus(200);
  createApplicant(newUser.firstName, newUser.lastName, newUser.email).then((response) => {
    const applicantId = response.id;
    console.log(`created applicant for: ${newUser.email} with applicant id: ${applicantId}`);
    updateApplicantId(newUser.id, applicantId);
  }).catch((error) => {
    console.log(error);
  })
});

module.exports = router;