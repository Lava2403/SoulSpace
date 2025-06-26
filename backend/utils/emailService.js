const nodemailer = require("nodemailer");

console.log('✅ Email User:', process.env.EMAIL_USER);
console.log('✅ Email Password:', process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


const sendVerificationEmail = async (email, username, token) => {
    const verificationLink = `http://localhost:5000/api/auth/verify/${token}`;

    const mailOptions = {
        from: `"Team SoulSpace 🌿" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Welcome to SoulSpace - Please verify your account',
        html: `
            <h2>Hello ${username},</h2>
            <p>Click on the link below to verify your email:</p>
            <a href="${verificationLink}">${verificationLink}</a>
            <p>This link will expire in 10 minutes.</p>
        `,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendVerificationEmail;
