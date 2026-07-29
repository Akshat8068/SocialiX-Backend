import { z } from "zod"
import type { Request, Response, NextFunction } from "express"


export const userProfileValidation = z.object({
    fullname: z.string(),
    username: z.string().optional(),
    bio: z.string().max(250, "Max 250 words only").optional(),
    website: z.string().url("Invalid website URL").optional(),
    accountType: z.enum(["PUBLIC", "PRIVATE"]).optional(),
    professionalAccount: z.boolean().optional()
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