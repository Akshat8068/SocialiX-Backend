import type { NextFunction, Request, Response } from "express";
import type { login, register } from "../../types/types.js";
import userRepositoryMethods from "../../repository/user.repository.js";
import otpRepositoryMethods from "../../repository/otp.repository.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { generateAccessToken, generateRefershToken } from "../../utils/utils.js";
import cookiesoptions from "../../config/cookie.config.js";
import { sendOtp } from "../../utils/utils.js";



const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { fullname, username, email, password }: register = req.body

        const existEmail = await userRepositoryMethods.findByEmail(email)
        if (existEmail) {
            return res.status(409).json({
                success: false,
                message: "Email Alreday Exists"
            })
        }
        const existUsername = await userRepositoryMethods.findByUserName(username)
        if (existUsername) {
            return res.status(409).json({
                success: false,
                message: "username Alreday taken"
            })
        }
        const salt = await bcrypt.genSalt(10)
        const hasedPassword = await bcrypt.hash(password, salt)

        const user = await userRepositoryMethods.createUser(
            {
                fullname,
                username,
                email,
                password: hasedPassword
            }
        )

        await sendOtp(user!.id, email, "Verify your SocialiX account")

        return res.status(201).json({
            success: true,
            message: "User Registerd Successfully , Please verify your email",
            data: user
        })
    }
    catch (error) {
        next(error)
    }
}

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password }: login = req.body
        console.log(req.body);

        const user = await userRepositoryMethods.findByEmail(email)
        if (!user) {
            return res.status(409).json({
                success: false,
                message: "Email Alreday Exists"
            })
        }
        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: "Please verify your email first"
            })
        }

        const passwordCheck = await bcrypt.compare(password, user.password)
        if (!passwordCheck) {
            return res.status(401).json({
                success: false,
                message: "invalid Password "
            })
        }
        const accessToken = generateAccessToken(user.id)
        const refreshToken = generateRefershToken(user.id)
        res.cookie("RefreshToken", refreshToken, cookiesoptions)
        res.status(200).json({
            success: true,
            message: "User Login succesfully",
            accessToken,
            data: {
                id: user.id,
                email: user.email,
                username: user.username,
                fullname: user.fullname
            }
        })
    }
    catch (error) {
        next(error)
    }
}

const refreshToken = (req: Request, res: Response, next: NextFunction) => {

    const token = req.cookies.RefreshToken
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Refresh token not found"
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as { id: number }

        const accessToken = generateAccessToken(decoded.id)

        return res.status(200).json({
            success: true,
            message: "Access token generated succesfull", accessToken
        })

    } catch (error) {
        return res.status(200).json({
            success: false,
            message: "invalid refresh token "
        })
    }

}

const forgetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body

        const user = await userRepositoryMethods.findByEmail(email)
        if (!user) {
            return res.status(409).json({
                success: false,
                message: "Email Alreday Exists"
            })
        }

        await sendOtp(user.id, email, "Reset your SocialiX password")

        return res.status(200).json({
            success: true,
            message: "OTP sent to your email"
        })
    }
    catch (error) {
        next(error)
    }
}

const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, otp, newPassword } = req.body

        const user = await userRepositoryMethods.findByEmail(email)
        if (!user) {
            return res.status(409).json({
                success: false,
                message: "Email Alreday Exists"
            })
        }

        const otpRecord = await otpRepositoryMethods.findOtpByUserId(user.id)
        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: "OTP not found , please request again"
            })
        }

        if (new Date() > otpRecord.expiresAt) {
            return res.status(400).json({
                success: false,
                message: "OTP expired , please request again"
            })
        }

        if (otpRecord.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hasedPassword = await bcrypt.hash(newPassword, salt)

        await userRepositoryMethods.updatePassword(user.id, hasedPassword)
        await otpRepositoryMethods.deleteOtp(otpRecord.id)

        return res.status(200).json({
            success: true,
            message: "Password reset successfully"
        })
    }
    catch (error) {
        next(error)
    }
}

const emailVerify = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, otp } = req.body

        const user = await userRepositoryMethods.findByEmail(email)
        if (!user) {
            return res.status(409).json({
                success: false,
                message: "Email Alreday Exists"
            })
        }

        const otpRecord = await otpRepositoryMethods.findOtpByUserId(user.id)
        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: "OTP not found , please request again"
            })
        }

        if (new Date() > otpRecord.expiresAt) {
            return res.status(400).json({
                success: false,
                message: "OTP expired , please request again"
            })
        }

        if (otpRecord.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            })
        }

        await userRepositoryMethods.verifyUser(user.id)
        await otpRepositoryMethods.deleteOtp(otpRecord.id)

        return res.status(200).json({
            success: true,
            message: "Email verified successfully"
        })
    }
    catch (error) {
        next(error)
    }
}

const resendEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body

        const user = await userRepositoryMethods.findByEmail(email)
        if (!user) {
            return res.status(409).json({
                success: false,
                message: "Email Alreday Exists"
            })
        }
        if (!user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "Email already verified"
            })
        }

        await sendOtp(user.id, email, "Verify your SocialiX account")

        return res.status(200).json({
            success: true,
            message: "OTP resent to your email"
        })
    }
    catch (error) {
        next(error)
    }
}

const logout = (req: Request, res: Response, next: NextFunction) => {
    try {
        res.clearCookie("RefreshToken", cookiesoptions)
        res.status(200).json({
            success: true,
            message: "Logout successfully"
        })
    }
    catch (error) {
        next(error)
    }
}

const authController = {
    register, login, refreshToken,
    forgetPassword, resetPassword, resendEmail
    , emailVerify, logout
}
export default authController
