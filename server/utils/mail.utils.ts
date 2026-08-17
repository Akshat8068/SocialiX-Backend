import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendOtpEmail = async (
    email: string,
    subject: string,
    otp: string
): Promise<void> => {
    const { data, error } = await resend.emails.send({
        from: "SocialiX <onboarding@resend.dev>",
        to: ["akshatyadav@thoughtwin.com"],
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
    })

    if (error) {
        console.error("Resend email error:", error)
        throw new Error(error.message)
    }

    console.log("OTP email sent:", data)
};