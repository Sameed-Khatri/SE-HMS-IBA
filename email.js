const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "sambp1647@gmail.com",
    pass: "xzvu epjt xgre hkcv",
  },
});

const mailOptions = {
    from:{
        name: "Martin Dow",
        address: "sambp1647@gmail.com",
    },
    to: ["abc@gmail.com"],
    subject: "Hello ✔",
    text: "Hello world?",
    html: "<b>Hello world?</b>"
};

const sendMail = async (transporter, mailOptions) => {
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Message sent: %s", info.messageId);
    } catch (error) {
      console.error(error);
    }
  };
// sendMail(transporter,mailOptions);

module.exports={transporter,mailOptions,sendMail};