import type { UploadApiResponse } from "cloudinary"
import fs from "node:fs"
import cloudinary from "../config/cloudinary.config.js"
import type { UploadApiErrorResponse } from "cloudinary"

const uploadToCloudinary=async(filePath:string):Promise<UploadApiResponse>=>{
    try {
        const result=await cloudinary.uploader.upload(filePath,{
            resource_type:"auto"
        })
        if(fs.existsSync(filePath)){
            fs.unlinkSync(filePath)
        }
        return result
    } catch (error) {
        if(fs.existsSync(filePath)){
            fs.unlinkSync(filePath)
        }
         throw error
    }
}
 const deleteFromCloudinary = async (publicId: string): Promise<UploadApiResponse | UploadApiErrorResponse> => {
  return await cloudinary.uploader.destroy(publicId);
}
const cloudinaryMethod={uploadToCloudinary,deleteFromCloudinary}
export default cloudinaryMethod