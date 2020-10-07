const express = require('express');
const router = express.Router();
const configuration = require('../util/config');
const { getApplicantId } = require('../services/okta');
const { getSDKToken, startCheck } = require('../services/onfido');

/* GET home page. */
router.get('/', (req, res) => {
  const user = req.query['user'];
  getApplicantId(user).then((applicant) => {
    const applicantId = applicant.profile.onfidoApplicantId;
    req.session.applicantId = applicantId;
    getSDKToken(applicantId).then((token) => {
      res.render('index', { token: token });
    })
  })
});

router.post('/', (req, res) => {
  const applicantId = req.session.applicantId
  startCheck(applicantId, ['document', 'facial_similarity_photo']).then((result) => {
    res.json({ redirect: configuration.appURL + configuration.port + '/done'});
  })
});

router.get('/done', (req, res) => {
  res.render('complete');
});

module.exports = router;
