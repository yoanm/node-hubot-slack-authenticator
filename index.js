'use strict';

const SlackAuthenticator = require('slack-authenticator');
const middlewareFactory = require('./src/middleware-factory');

module.exports = {
  initHubot: (robot) => {
    if (!robot.slackAuthenticator) {
      if (process.env.SLACK_SIGNING_SECRET) {
        const helper = new SlackAuthenticator(process.env.SLACK_SIGNING_SECRET);
        const middleware = middlewareFactory(helper, robot);

        robot.slackAuthenticator = {helper, middleware};

        robot.logger.debug('hubot-slack-authenticator initialized !');
      } else {
        throw new Error("No SLACK_SIGNING_SECRET provided to authenticate slack request !");
      }
    } else {
      robot.logger.info('hubot-slack-authenticator already initialized => skipped !');
    }
  }
};
