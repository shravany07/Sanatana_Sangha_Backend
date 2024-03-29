import nodemailer from 'nodemailer';
import config from 'config/config';
import { logger } from 'config/logger';

export const transport = nodemailer.createTransport(config.email.smtp);

/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}
/**
 * Send an email
 * @returns {Promise}
 * @param emailParams
 */
export const sendEmail = async (emailParams) => {
  const { to, subject, text, isHtml } = emailParams;
  const msg = { from: config.email.from, to, subject, text };
  if (isHtml) {
    delete msg.text;
    msg.html = text;
  }
  await transport.sendMail(msg);
};

/**
 * Send an email
 * @param {String} from
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendAdminEmail = async (from, to, subject, text) => {
  const msg = { from: from || config.email.from, to, subject, text };
  await transport.sendMail(msg);
};
/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
export const sendResetPasswordEmail = async (to, token) => {
  const subject = 'Reset password';
  // replace this url with the link to the reset password page of your front-end app
  // const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
  const text = `Dear user,
  To reset your password, Copy this Code: ${token}
  If you did not request any password resets, then ignore this email.`;
  await sendEmail({ to, subject, text });
};

/**
 * Send Verification email
 * @param {Object} user
 * @param {string} token
 * @returns {Promise}
 */
export const sendEmailVerificationEmail = async (user, token, role) => {
  const { email: to, name } = user;
  const subject = 'Welcome to the Swaray Family!';
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `${config.front.url}/v1/${role}/auth/verify-email?token=${token}`;
  const text = `
<html lang="en">
<head>
<style>
.btn {
  display: inline-block;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  color: #ffffff !important;
  background-color: #007bff;
  border: 1px solid #007bff;
  box-shadow: none;
  text-decoration: none;
}
.text-center {
text-align: center
}
</style>
</head>
<body>
<div>
<div>Dear ${name},</div>
<br>
  <div>We’re super excited that you’ve decided to join Swaray for Video Chat That’s Built to Party!</div><br>
  <div>You’re just one step away from getting access to fun, exciting, party and drinking games and Swaray’s legendary shared music experience.</div><br>
  <div>All you have to do is click the link below to confirm it’s you and you’re in!</div><br>
  <div><a   target="_blank" href="${resetPasswordUrl}" id="verifyButton" class="btn btn-primary" >Click here to Verify</a></div><br>
  <div>If for some reason you clicked the Sign-Up button in error or you didn’t Sign-Up with this email address</div>
  <div>in the first place, no need to worry.  You can completely ignore this email and we’ll delete the account for you.</div><br>
  <div>If you still have questions or concerns just shoot us a note at info@swarayallday.com and we’ll be sure to help you out.</div><br>
  <div>Thanks!</div><br/><br>
  <img src="${config.front.url}/images/logo.jpg"><br><br>
  <div class="text-center">Swaray LLC</div>
  <div class="text-center">627 Promontory Drive East</div>
  <div class="text-center">Newport Beach, CA 92660</div><br>
  <a class="text-center" target="_blank" href="https://www.google.com" >unsubscribe from this list</a><br><br>
  </div>
  </body>
  </html>
`;
  await sendEmail({ to, subject, text, isHtml: true });
};

/**
 * @param {Object} feedBack
 * @returns {Promise<void>}
 */
export const sendFeedBackEmail = async (feedBack) => {
  const { comment, user } = feedBack;
  const { name } = user;
  const subject = `Feedback received from ${name}`;
  const text = `Below is the feedback received from ${name} \n FeedBack: ${comment}`;
  await sendAdminEmail(config.email.from, config.email.from, subject, text);
};

/**
 * @returns {Promise<void>}
 * @param reporter
 * @param reportedUser
 * @param party
 * @param comment
 */
export const sendReportUserEmail = async (reporter, reportedUser, party, comment) => {
  const { name: reporterName, _id: reportedId } = reporter;
  const { name, _id: reportedUserId } = reportedUser;
  const subject = `Regarding Report of user ${name}`;
  const text = `${name}, ${reportedUserId} is blocked by ${reporterName}, ${reportedId} \n  The reason is : ${comment} \n partyId: ${party._id}`;
  await sendAdminEmail(config.email.from, config.email.from, subject, text);
};

/**
 * Send Verification email
 * @param {Object} user
 * @param otp
 * @returns {Promise}
 */
export const sendOtpVerificationEmail = async (user, otp) => {
  const { email: to } = user;
  const subject = 'Otp verification email!';
  const text = `Dear user,
  Your email verification Code, Copy this Code: ${otp}
  If you did not request any password resets, then ignore this email.`;
  await sendEmail({ to, subject, text, isHtml: false })
    .then(() => logger.info('email sent successfully'))
    .catch((error) => logger.warn(`Unable to send mail ${error}`));
};
