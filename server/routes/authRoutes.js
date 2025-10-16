import express from 'express'
import { doctorLogin, doctorLogout, doctorRegister, isAuthenticated, isDoctorAuthenticated, login, logOut, register, resetDoctorPassword, resetPassword, sendDoctorResetOtp, sendResetOtp, sendTestEmail, verifyDoctorResetOtp, verifyResetOtp } from '../controllers/authController.js';
import userAuth from '../middleware/userAuth.js';
import doctorAuth from '../middleware/doctorAuth.js';

const authRouter = express.Router();

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.post('/logout', logOut)
authRouter.get('/is-auth', userAuth, isAuthenticated);
authRouter.post('/send-reset-otp', sendResetOtp);
authRouter.post('/verify-reset-otp', verifyResetOtp);
authRouter.post('/reset-password', resetPassword);
authRouter.post('/doctor-register',doctorRegister)
authRouter.post('/doctor-login',doctorLogin)
authRouter.post('/doctor-logout',doctorLogout)
authRouter.get('/doctor-is-auth',doctorAuth,isDoctorAuthenticated)
authRouter.post('/doctor-send-reset-otp', sendDoctorResetOtp);
authRouter.post('/doctor-verify-reset-otp', verifyDoctorResetOtp);
authRouter.post('/doctor-reset-password', resetDoctorPassword);



if (process.env.NODE_ENV === 'development') {
    authRouter.post('/test-email', sendTestEmail);
}
export default authRouter;
