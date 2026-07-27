import { ILike, Repository } from "typeorm"
import AppDataSource from "../config/app.DataSource.js"
import { User } from "../entities/user.entity.js"
import { string } from "zod"

const userRepository: Repository<User> = AppDataSource.getRepository(User)


const findByEmail = async (email: string): Promise<User | null> => {
    return await userRepository.findOne({
        where: { email },
        select: {
            password: true,
            id: true,
            fullname: true,
            username: true,
            email: true,
            isVerified: true,
        }
    })
}

const findByUserName = async (username: string): Promise<User | null> => {
    return await userRepository.findOne({
        where: { username },
    })
}

const findById = async (id: number): Promise<User | null> => {
    return await userRepository.findOne({
        where: { id },
    })
}

const createUser = async (userData: Partial<User>): Promise<User | null> => {
    const user = userRepository.create(userData)
    return await userRepository.save(user)
}

const verifyUser = async (id: number): Promise<void> => {
    await userRepository.update(id, { isVerified: true })
}

const updatePassword = async (id: number, password: string): Promise<void> => {
    await userRepository.update(id, { password })
}
const updateProfile = async (id: number,updateData: Partial<User>): Promise<User | null> => {
  await userRepository.update(id, updateData);

  return await userRepository.findOne({
    where: { id },
  })
}

const updateProfilePicture = async (id: number,profilePicture: string,profilePicturePublicId: string) => {
    return await userRepository.update({ id },
        {
            profilePicture,
            profilePicturePublicId,
        }
    )
}

const removeProfilePicture = async (id: number) => {
    return await userRepository.update(
        { id },
        {
            profilePicture:null,
            profilePicturePublicId: null
        }
    )
}



const userRepositoryMethods = { findByEmail, findById, findByUserName, createUser,
     verifyUser, updatePassword,
    updateProfile,updateProfilePicture,removeProfilePicture }
export default userRepositoryMethods