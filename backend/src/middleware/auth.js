const { auth } = require('express-oauth2-jwt-bearer');
const config = require('../config');

const checkJwt = auth({
  audience: config.auth0.audience,
  issuerBaseURL: config.auth0.issuerBaseURL,
  tokenSigningAlg: 'RS256',
});

module.exports = checkJwt;
