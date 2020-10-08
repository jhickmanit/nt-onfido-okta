const express = require('express');
const router = express.Router();
const configuration = require('../util/config');
const { handleHook, getCheckResult } = require('../services/onfido');
const { findUser, updateIdvStatus } = require('../services/okta');

router.post('/hook', (req, res) => {
  console.log('got onfido hook request');
  handleHook(req).then((response) => {
    if (response.hasOwnProperty('error')) {
      console.log(`webhook validation had an error: ${response}`);
      return res.status(403).json({ error: 'unable to validate webhook token: ' + error });
    }
    console.log(`got event object: ${response}`);
    getCheckResult(response.object.id).then((check) => {
      const applicant = check.applicant_id;
      const result = check.result;
      console.log(`got check object: ${check}`);
      findUser(applicant).then((user) => {
        console.log(`got applicant: ${user}`);
        updateIdvStatus(user.id, result).then((output) => {
          console.log(`updated okta user: ${output}`);
          return res.status(200);
        });
      });
    });
  });
});

module.exports = router;
