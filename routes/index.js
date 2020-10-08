const express = require('express');
const router = express.Router();
const configuration = require('../util/config');
const { getApplicantId } = require('../services/okta');
const { getSDKToken, startCheck } = require('../services/onfido');

/* GET home page. */
router.get('/', (req, res) => {
  const user = req.query['user'];
  console.log('request for sdk with user: ' + user);
  getApplicantId(user).then((applicant) => {
    const applicantId = applicant.profile.onfidoApplicantId;
    console.log(`found applicantId: ${applicantId} for user: ${user}`);
    req.session.applicantId = applicantId;
    getSDKToken(applicantId).then((token) => {
      console.log(`generated sdk token for user: ${user}`);
      res.render('index', { token: token });
    }).catch((error) => {
      res.render('error', { message: 'error generating token', error });
    })
  }).catch((error) => {
    res.render('error', { message: 'error generating token', error });
  })
});

router.post('/', (req, res) => {
  const applicantId = req.session.applicantId
  console.log(`got applicant id from session: ${applicantId}`);
  startCheck(applicantId, ['document', 'facial_similarity_photo']).then((result) => {
    console.log(`started check for: ${applicantId}`)
    res.json({ redirect: configuration.appURL + configuration.port + '/done'});
  }).catch((error) => {
    res.render('error', { message: 'cannot create check', error })
  })
});

router.get('/done', (req, res) => {
  res.render('complete');
});

module.exports = router;
