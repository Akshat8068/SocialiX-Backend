import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});
transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } 
});
console.log("EMAIL_USER exists:", !!process.env.EMAIL_USER);
console.log("EMAIL_PASSWORD exists:", !!process.env.EMAIL_PASSWORD);
export const sendOtpEmail = async (
    email: string,
    subject: string,
    otp: string
): Promise<void> => {
    await transporter.sendMail({
        from: `"SocialiX" <${process.env.EMAIL_USER}>`,
        to: email,
        subject,
        html: `
            <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto;">
                <h2>SocialiX</h2>

                <p>Your One-Time Password (OTP) is:</p>

                <h1 style="letter-spacing:5px; color:#2563eb;">
                    ${otp}
                </h1>

                <p>This OTP is valid for <b>5 minutes</b>.</p>

                <p>If you did not request this OTP, please ignore this email.</p>

                <br/>

                <p>Thanks,<br/>SocialiX Team</p>
            </div>
        `,
    });
};

