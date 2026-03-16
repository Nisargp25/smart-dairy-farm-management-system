const twilio = require('twilio');

const sendSMS = async (to, body) => {
  try {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
      console.warn('Twilio credentials missing. Skipping SMS.');
      return;
    }

    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    await client.messages.create({
      body: `🐄 DairyPrecision: ${body}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    });
    console.log(`SMS sent to ${to}`);
  } catch (error) {
    console.error('Error sending SMS via Twilio:', error.message);
  }
};

module.exports = { sendSMS };
