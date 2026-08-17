import { Repository } from "typeorm";
import AppDataSource from "../../config/app.DataSource.js";
import  { Otp } from "./otp.entity.js";


const otpRepository: Repository<Otp> = AppDataSource.getRepository(Otp);

const createOtp = async (otpData: Partial<Otp>): Promise<Otp> => {
    const otp = otpRepository.create(otpData);
    return await otpRepository.save(otp);
};

const findOtpByUserId = async (userId: number): Promise<Otp | null> => {
    return await otpRepository.findOne({
        where: { userId }
    });
};

const deleteOtp = async (id: string): Promise<void> => {
    await otpRepository.delete(id);
};

const deleteOldOtp = async (userId: number): Promise<void> => {
    await otpRepository.delete({ userId });
};

const otpRepositoryMethods = {
    createOtp,
    findOtpByUserId,
    deleteOtp,
    deleteOldOtp,
};

export default otpRepositoryMethods;