const register = (req, res) => {
    res.status(200).json({
        success: true,
        message: "Register API"
    });
};
const login = (req, res) => {
    res.status(200).json({
        success: true,
        message: "login API"
    });
};
const refreshToken = (req, res) => {
    res.status(200).json({
        success: true,
        message: "Reset Password"
    });
};
const forgetPassword = (req, res) => {
    res.status(200).json({
        success: true,
        message: "forgetPassword"
    });
};
const resetPassword = (req, res) => {
    res.status(200).json({
        success: true,
        message: "Reset Password"
    });
};
const emailVerify = (req, res) => {
    res.status(200).json({
        success: true,
        message: "email Verify api"
    });
};
const resendEmail = (req, res) => {
    res.status(200).json({
        success: true,
        message: "Resend email Verify api"
    });
};
const logout = (req, res) => {
    res.status(200).json({
        success: true,
        message: "logout api"
    });
};
const authController = { register, login, refreshToken,
    forgetPassword, resetPassword, resendEmail,
    emailVerify, logout
};
export default authController;
//# sourceMappingURL=authController.js.map