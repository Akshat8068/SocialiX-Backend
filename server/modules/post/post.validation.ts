import { z } from "zod"
import { PostVisibility } from "../../types/types.js"
import type { NextFunction, Request, Response } from "express"
export const createPostSchema = z.object({
  caption: z
    .string()
    .trim()
    .max(2200, "Caption must not exceed 2200 characters.")
    .optional(),

  visibility: z
    .enum(PostVisibility)
    .optional(),

  hashtags: z
    .array(z.number().int().positive())
    .optional(),
})

export const PostSchema = z.object({
  caption: z
    .string()
    .trim()
    .max(2200, "Caption must not exceed 2200 characters.")
    .optional(),

  visibility: z
    .enum(PostVisibility)
    .optional(),

  hashtags: z
    .array(z.number().int().positive())
    .optional()
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

