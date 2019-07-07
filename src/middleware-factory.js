'use strict';

const logHeader = '[SECURITY] Slack authenticator : ';

const loggerWrapper = (baseLogger) => ({
    info: (message, context) => baseLogger.info(logHeader, message, context),
    error: (message, context) => baseLogger.error(logHeader, message, context),
    debug: (message, context) => baseLogger.debug(logHeader, message, context),
});

module.exports = (authentHelper, robot) => {
    const customLogger = loggerWrapper(robot.logger);

    return (req, res, next) => {
        let remoteIp;
        let {headers, body, connection, url, method} = req;
        const logContext = {url, method};
        try {
            if (!req.skipSlackAuthenticator) {
                if (!req._slackAuthenticatorSuccessfull) {
                    remoteIp = (headers && headers['x-forwarded-for'])
                        ? headers['x-forwarded-for']
                        : ((connection && connection.remoteAddress) ? connection.remoteAddress : 'UNKNOWN IP')
                    ;

                    authentHelper.validate(headers['x-slack-signature'], body, headers['x-slack-request-timestamp']);

                    customLogger.info('authentication success', {...logContext, remoteIp});
                    req._slackAuthenticatorSuccessfull = true;
                } else {
                    customLogger.debug('already authenticated !', logContext);
                }
            } else {
                customLogger.debug('programmatically skipped', logContext);
            }

            next();
        } catch(error) {
            const responseCode = error.httpCode ? error.httpCode : 401;
            customLogger.error(
                'authentication failed !',
                {...logContext, error, body, responseCode, remoteIp}
            );

            res.status(responseCode).send();

            robot.emit('error', error)
        }
    }
};
