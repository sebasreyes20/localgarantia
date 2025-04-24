require('dotenv').config({ path: '.env.local' });
const sgMail = require('@sendgrid/mail');

if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_API_KEY.startsWith('SG.')) {
  console.error('ERROR: SENDGRID_API_KEY is missing or malformed.');
  process.exit(1);
}
if (!process.env.ADMIN_EMAILS) {
  console.error('ERROR: ADMIN_EMAILS is missing from environment.');
  process.exit(1);
}
if (!process.env.EMAIL_FROM) {
  console.error('ERROR: EMAIL_FROM is missing from environment.');
  process.exit(1);
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: process.env.ADMIN_EMAILS.split(',')[0],
  from: process.env.EMAIL_FROM,
  subject: 'Test Email from SendGrid',
  text: 'This is a test email sent from SendGrid integration.',
  html: '<strong>This is a test email sent from SendGrid integration.</strong>',
};

sgMail
  .send(msg)
  .then(() => {
    console.log('Test email sent successfully!');
  })
  .catch((error) => {
    console.error('Error sending test email:', error);
    if (error.response && error.response.body) {
      console.error(error.response.body);
    }
  });
