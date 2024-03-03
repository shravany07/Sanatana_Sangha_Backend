import express from 'express';
import passport from 'passport';
import auth from 'middlewares/auth';
import validate from 'middlewares/validate';
import { authValidation } from 'validations/user';
import { authController } from 'controllers/user';
// import verifyCaptcha from 'middlewares/captcha';
const router = express.Router();
/**
 * Get the Refresh Token for the User
 */
router.post('/refresh-tokens', validate(authValidation.refreshTokens), authController.refreshTokens);
/**
 * Logout the API for the User
 */
router.post('/logout', auth(), validate(authValidation.logout), authController.logout);
/**
 * Google login API for the User
 */
router.post(
  '/google',
  validate(authValidation.googleLogin),
  passport.authenticate('google-token', { session: false, json: true }),
  authController.socialLogin
);
module.exports = router;
