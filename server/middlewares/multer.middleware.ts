import multer from "multer";
import crypto from "node:crypto";
import path from "node:path";
import type { Request } from "express";

const storage = multer.diskStorage({
    destination: (req: Request,file: Express.Multer.File,cb) => {
        cb(null, "uploads/")
    },

    filename: (req: Request,file: Express.Multer.File,cb) => {
        const extension = path.extname(file.originalname)
        cb(null, `${crypto.randomUUID()}${extension}`)
    },
})

const upload = multer({storage})

export default upload;