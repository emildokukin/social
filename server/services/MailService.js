const nodemailer = require("nodemailer");
require("dotenv").config();

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendActivationMail(to, link) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: `Account activation ${process.env.API_URL}`,
      text: "",
      html: `
                <div>
                    <h1>Click on the link to activate your account</h1>
                    <p>Your code: <pre>${link}</pre></p>
                    <a href="${link}">Activate account</a>
                </div>
            `,
    });
  }
}

module.exports = new MailService();
