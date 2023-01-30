const express = require("express");
const nodemailer = require("nodemailer");
const app = express();
const cors = require("cors");
require("dotenv").config();

//! middleware
app.use(express.json());
app.use(cors());

//! Nodemailer setup step 1
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

//! Nodemailer setup step 2
transporter.verify((err, success) => {
  err
    ? console.log(err)
    : console.log(`==== Server is ready to take messages: ${success} ===`);
});

//! Routing
app.post("/send", function (req, res) {
  //! Nodemailer step 3
  let mailOptions = {
    from: `"🌎 Portfolio KB"<${process.env.USER_EMAIL}>`,
    to: process.env.DESTINATION_EMAIL,
    subject: "FerCruz Portfolio Message",
    html: `   
    <div
      style="
        background-color: black;
        border-radius: 8px;
        padding: 50px;
        margin: 10px;
      "
    >
      <h1 style="color: orange">Hi!</h1>
      <h3 style="color: orange">• New message from:</h3>
      <p style="color: white">${req.body.mailerState.name}</p>
      <h3 style="color: orange">• Email:</h3>
      <p style="color: white">${req.body.mailerState.email}</p>
      <h3 style="color: orange">• Message:</h3>
      <p style="color: white">${req.body.mailerState.message}</p>
    </div>`,
  };

  //! Nodemailer step 4
  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      res.json({
        status: "fail",
      });
    } else {
      console.log("---- Message Sent ----");
      res.json({ status: "success" });
    }
  });
});

//! Server connection
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}...`);
});
