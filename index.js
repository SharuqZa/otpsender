const express = require('express');
const dotenv = require('dotenv');
const twilio = require('twilio');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let generatedOTP; 
let otpTimestamp; 

// Generate a random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

app.post('/sendOTP', (req, res) => {
  const mobileNumber = req.body.mobile;
  generatedOTP = generateOTP(); 
  otpTimestamp = Date.now();

  client.messages
    .create({
      body: `Your OTP is: ${generatedOTP}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: mobileNumber,
    })
    .then(message => {
      console.log(`OTP sent to ${mobileNumber}: ${generatedOTP}`);
      res.json({ success: true, message: 'otp sent successfully' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ success: false, message: 'failed to send otp' });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});