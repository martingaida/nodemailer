const express = require('express');
const bodyParser = require('body-parser');
const expressHandle = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

// Environment variables
const port = process.env.PORT;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const USER = process.env.USER;
const TARGET_EMAIL = process.env.TARGET_EMAIL;

// View engine setup
app.engine('handlebars', expressHandle.engine());
app.set('view engine', 'handlebars');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Google authentication - OAuth client
const OAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
OAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// Setup email body
const output = `<h1>IT'S WORKING!</h1>`;

// Setup email data
const email = {
    from: USER, // sender address
    to: TARGET_EMAIL, // list of receivers
    subject: "Nodemailer Test", // Subject line
    text: 'Test. Test. Test.', // plain text body
    html: output, // html body
};

// SendMail function
async function sendMail() {
    try {
        const ACCESS_TOKEN = await OAuth2Client.getAccessToken()

        // Nodemailer setup
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: USER,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: ACCESS_TOKEN
            }
        })
        const result = await transporter.sendMail(email)
        console.log(result)
        return result

    } catch (error) {
        console.log(error)
    }
};

// Default route
app.get('/', (req, res) => {
    res.render('form', { msg:'Ready to send.' });
});

// Send route
app.post('/send', (req, res) => {
    sendMail()
});

app.listen(port, () => console.log('Server running...'));