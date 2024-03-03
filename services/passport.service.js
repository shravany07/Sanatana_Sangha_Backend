import passport from 'passport';
import config from 'config/config';
import { Strategy as GoogleStrategy } from 'passport-token-google2';
import { authService } from 'services';
/**
 * we are calling this function since we need to register this in the passport Service so that in auth route it can find the appropriate strategy
 * */
module.exports = (function () {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.google.clientID,
        clientSecret: config.google.clientSecret,
      },
      function (accessToken, refreshToken, profile, done) {
        authService
          .createSocialUser(accessToken, refreshToken, profile, 'google')
          .then((user) => done(null, user))
          .catch((err) => done(err, null));
      }
    )
  );
})();
