const logger = require('../Library/logger')

function isTokenPresent(req, res, next) {
    logger.info("Verifying token present from client.")
    const jwttoken = req.headers['authorization'];
    if(typeof jwttoken !== 'undefined') {
      req.token = jwttoken;
      next();
    } else {
      res.sendStatus(403);
    }
}

module.exports = {
    isTokenPresent
}