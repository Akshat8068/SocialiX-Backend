import jwt from "jsonwebtoken"
import otpRepositoryMethods from "../modules/auth/otp.repository.js";
import { sendOtpEmail } from "./mail.utils.js";

export const generateAccessToken = (id:number) => {
    const token = jwt.sign({
        id: id
    }, process.env.ACCESS_TOKEN_SECRET!, {
        expiresIn: '10m'
    })
    return token
}
export const generateRefershToken = (id:number) => {
    const token = jwt.sign({
        id: id
    }, process.env.REFRESH_TOKEN_SECRET!, {
        expiresIn: '10d'
    })
    return token
}
export const generateOtp = (): string => {
    return Math.floor(1000 + Math.random() * 9999).toString();
};

export const sendOtp = async (userId: number, email: string, subject: string): Promise<void> => {
    await otpRepositoryMethods.deleteOldOtp(userId)
    const otp = generateOtp()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000)
    await otpRepositoryMethods.createOtp({ userId, otp, expiresAt })
    await sendOtpEmail(email, subject, otp)
}