const sendEmail = async (to, subject, text) => {
  console.log(`[EmailService] Mock email sent to ${to}:`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${text}`);
  return true;
};

module.exports = { sendEmail };
