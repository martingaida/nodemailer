const express = require('express');
const bodyParser = require('body-parser');
const expressHandle = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

// View engine setup
app.engine('handlebars', expressHandle.engine());
app.set('view engine', 'handlebars');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('form', {msg:'Ready to send.'});
});

app.post('/send', (req, res) => {
    const output = `
        <h1>IT'S WORKING!</h1>
    `;

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        service: 'Gmail',
        auth: {
          user: 'therapy@nataliegaida.com', // generated ethereal user
          pass: '', // generated ethereal password
        },
    });
    
    // setup email data
    const email = {
        from: '"Martin 👻" <martingaida.mg@gmail.com>', // sender address
        to: 'nowicki.natalie@gmail.com', // list of receivers
        subject: "Forgotten Password Test ✔", // Subject line
        text: `It's working!`, // plain text body
        html: output, // html body
    };

    // send email with defined transport object
    transporter.sendMail(email, (error, info) => {
        if (error) {
            res.render('form', {msg:'Error'})
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        res.render('form', {msg:'Email has been successfully sent.'})
    });    

});

app.listen(3000, () => console.log('Server running...'));