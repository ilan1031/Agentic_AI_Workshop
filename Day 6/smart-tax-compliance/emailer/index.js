const nodemailer = require("nodemailer");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

app.post("/send", async (req, res) => {
  const { to, subject, text } = req.body;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      text,
    });
    res.send({ success: true });
  } catch (err) {
    res.status(500).send({ error: err.toString() });
  }
});

app.listen(3001, () => console.log("Emailer running on port 3001"));
