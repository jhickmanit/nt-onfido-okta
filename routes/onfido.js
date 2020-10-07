const express = require('express');
const router = express.Router();
const configuration = require('../util/config');
const { handleHook, getCheckResult } = require('../services/onfido');
const { findUser, updateIdvStatus } = require('../services/okta');

router.post('/hook', (req, res) => {
  handleHook(req).then((response) => {
    if (response.hasOwnProperty('error')) {
      return res.status(403).json({ error: 'unable to validate webhook token: ' + error });
    }
    getCheckResult(response.object.id).then((check) => {
      const applicant = check.applicant_id;
      const result = check.result;
      findUser(applicant).then((user) => {
        updateIdvStatus(user.id, result).then((output) => {
          return res.status(200);
        });
      });
    });
  });
});

module.exports = router;
