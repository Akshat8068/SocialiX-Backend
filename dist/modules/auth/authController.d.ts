import type { Request, Response } from "express";
declare const register: (req: Request, res: Response) => void;
declare const login: (req: Request, res: Response) => void;
declare const refreshToken: (req: Request, res: Response) => void;
declare const forgetPassword: (req: Request, res: Response) => void;
declare const resetPassword: (req: Request, res: Response) => void;
declare const emailVerify: (req: Request, res: Response) => void;
declare const resendEmail: (req: Request, res: Response) => void;
declare const logout: (req: Request, res: Response) => void;
declare const authController: {
    register: typeof register;
    login: typeof login;
    refreshToken: typeof refreshToken;
    forgetPassword: typeof forgetPassword;
    resetPassword: typeof resetPassword;
    resendEmail: typeof resendEmail;
    emailVerify: typeof emailVerify;
    logout: typeof logout;
};
export default authController;
//# sourceMappingURL=authController.d.ts.map