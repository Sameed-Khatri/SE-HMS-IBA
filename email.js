const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "",
    pass: "",
  },
});

const mailOptions = {
    from:{
        name: "Martin Dow",
        address: "xyz7@gmail.com",
    },
    to: ["abc@gmail.com"],
    subject: "Hello ✔",
    text: "Hello world?",
    html: "<b>Hello world?</b>"
};

const sendMail=async(transporter,mailOptions)=>{
    try {
        await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);

    } catch (error) {
        console.error(error)
    }
}
// sendMail(transporter,mailOptions);

module.exports={transporter,mailOptions,sendMail};