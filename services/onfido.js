var { Onfido, Region, WebhookEventVerifier } = require('@onfido/api')
var configuration = require('../util/config.js');

const client = new Onfido({
  apiToken: configuration.onfidoAPIKey,
  region: Region[configuration.onfidoRegion] || Region.EU,
});

const verifier = new WebhookEventVerifier(configuration.onfidoWebhookToken)

const createApplicant = (firstName, lastName, email) => {
  return client.applicant.create({ firstName, lastName, email }).then((result) => {
    return result;
  })
}

const getSDKToken = (applicantId) => {
  return client.sdkToken.generate({ applicantId, referrer: '*://*/*'}).then((result) => {
    return result;
  })
}

const startCheck = (applicantId, reports) => {
  return client.check.create({ applicantId, reportNames: reports}).then((result) => {
    return result;
  })
}

const handleHook = (request) => {
  try {
    return verifier.readPayload(request.body, request.headers['X-SHA2-Signature']);
  } catch (error) {
    return { error };
  }
}

const getCheckResult = (checkId) => {
  return client.check.find(checkId).then((result) => {
    return result;
  });
}

const onfidoService = {
  createApplicant,
  getSDKToken,
  startCheck,
  handleHook,
  getCheckResult,
}
module.exports = onfidoService;