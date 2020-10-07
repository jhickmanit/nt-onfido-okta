class Configuration {
  constructor() {
    this.appSecret = process.env.APP_SECRET || 't#GS7Gq97@nu*?Cb';
    this.oktaOrgURL = process.env.OKTA_ORG_URL || 'https://unknown.com';
    this.oktaAPIKey = process.env.OKTA_API_KEY || 'unknown';
    this.oktaEventKey = process.env.OKTA_EVENT_KEY || 'unknown';
    this.onfidoAPIKey = process.env.ONFIDO_API_KEY || 'unknown';
    this.onfidoRegion = process.env.ONFIDO_REGION || 'EU';
    this.onfidoWebhookToken = process.env.ONFIDO_WEBHOOK_TOKEN || 'unknown';
    this.appURL = process.env.APP_URL || 'http://localhost';
    this.port = process.env.PORT || '3000';
  };
};

const configuration = new Configuration();
module.exports = configuration;