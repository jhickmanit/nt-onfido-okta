const okta = require('@okta/okta-sdk-nodejs');
const configuration = require('../util/config');

const client = new okta.Client({
  orgUrl: configuration.oktaOrgURL,
  token: configuration.oktaAPIKey,
});

const updateApplicantId = (oktaId, applicantId) => {
  const user = {
    profile: {
      onfidoApplicantId: applicantId,
    },
  };
  return client.partialUpdateUser(oktaId, user, {}).then((result) => {
    return result;
  });
}

const updateIdvStatus = (oktaId, status) => {
  const user = {
    profile: {
      onfidoIdvStatus: status,
    },
  };
  return client.partialUpdateUser(oktaId, user, {}).then((result) => {
    return result;
  });
}

const findUser = (applicantId) => {
  return client.listUsers({ filter: `onfidoApplicantId eq "${applicantId}"`}).each((user) => {
    return user;
  })
}

const getApplicantId = (user) => {
  return client.getUser(user).then((result) => {
    return result;
  })
}

const otkaService = {
  updateApplicantId,
  updateIdvStatus,
  findUser,
  getApplicantId,
};

module.exports = otkaService;