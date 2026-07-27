import { z } from "zod"
import type { Request, Response, NextFunction } from "express"

export const registerSchema = z.object({
    fullname: z.string(),
    username: z.string().min(2, "UserName must be atleast 2 charcters"),
    email: z.email("Invalid Email Address").toLowerCase(),
    password: z.string().min(8, "Password must be atleast 8 charcters")
})

export const loginSchema = z.object({
    email: z.email("Invalid Email Address").toLowerCase(),
    password: z.string().min(1, "Password is required")
})

export const validate = (schema: z.ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body)
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: result.error.issues[0]?.message
            })
        }
        req.body = result.data
        next()
    }
}