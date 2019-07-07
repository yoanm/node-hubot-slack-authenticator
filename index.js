'use strict';

const SlackAuthenticator = require('slack-authenticator');
const middlewareFactory = require('./src/middleware-factory');

// Dependencies:
//
// Configuration:
//
// Commands:
//
// Notes:
//

module.exports = {
  initHubot: (robot) => {
    if (!robot.slackAuthenticator) {
      const helper = new SlackAuthenticator(process.env.SLACK_SIGNING_SECRET);
      const middleware = middlewareFactory(helper, robot);

      robot.slackAuthenticator = {helper, middleware};

      robot.logger.debug('hubot-slack-authenticator initialized !');
    } else {
      robot.logger.info('hubot-slack-authenticator already initialized => skipped !');
    }
  }
};

