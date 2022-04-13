const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const dotenv = require('dotenv');

// Load environment variables from .env
dotenv.config();

// Environment variables
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const USER = process.env.USER_EMAIL;
const TARGET_EMAIL = process.env.TARGET_EMAIL;
let ACCESS_TOKEN;

// Google authentication - OAuth client
const OAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
OAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// Setup Nodemailer transport
const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: USER,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: ACCESS_TOKEN,
    },
});

// Setup email body
const output = `<h1>IT'S WORKING!</h1>`;

// Setup email data
const email = {
    from: `Nodemailer Test <${USER}>`,
    to: TARGET_EMAIL,
    subject: 'Nodemailer Test',
    text: 'Test. Test. Test.',
    html: output,
};

// SendMail function
async function sendMail() {
    try {
        ACCESS_TOKEN = await OAuth2Client.getAccessToken();
        const result = await transport.sendMail(email);
        return result

    } catch (error) {
        return error
    }
};

// Run app
sendMail()
    .then((result) => console.log('Email sent...', result))
    .catch((error) => console.log(error.message));