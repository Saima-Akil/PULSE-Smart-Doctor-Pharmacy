import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import transporter from '../config/nodemailer.js';

const otpStore = new Map();
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// ======================== USER AUTHENTICATION ========================

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ success: false, message: 'Missing Details' });
    }

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({ name, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });
        
        try {
            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: email,
                subject: 'Welcome to PULSE Medical Platform',
                text: `Welcome to PULSE medical platform. Your account has been created with email id: ${email}`
            };
            await transporter.sendMail(mailOptions);
            console.log(`Welcome email sent to ${email}`);
        } catch (emailError) {
            console.error('Welcome email failed:', emailError);
        }

        return res.json({ success: true, message: "Account Created Successfully" });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: 'Email and Password are required' });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "Invalid email" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        return res.json({ success: true, message: "Logged In Successfully" });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

export const logOut = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        });

        return res.json({ success: true, message: "Logged Out Successfully" });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

export const isAuthenticated = async (req, res) => {
    try {
        return res.json({ success: true, message: "Authenticated" });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// ======================== USER PASSWORD RESET ========================

export const sendResetOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.json({ success: false, message: 'Email is required' });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User with this email doesn't exist" });
        }

        const otp = generateOTP();
        
        otpStore.set(email, {
            otp,
            expires: Date.now() + 5 * 60 * 1000,
            attempts: 0
        });

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Password Reset OTP - PULSE',
            text: `Your OTP for password reset is: ${otp}. Valid for 5 minutes.`
        };

        await transporter.sendMail(mailOptions);

        return res.json({
            success: true,
            message: "OTP sent to your email successfully!"
        });

    } catch (error) {
        return res.json({
            success: false,
            message: "Failed to send OTP. Please try again."
        });
    }
};

export const verifyResetOtp = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.json({ success: false, message: 'Email and OTP are required' });
    }

    try {
        const storedData = otpStore.get(email);
        if (!storedData) {
            return res.json({
                success: false,
                message: "OTP expired or invalid"
            });
        }

        if (Date.now() > storedData.expires) {
            otpStore.delete(email);
            return res.json({
                success: false,
                message: "OTP has expired"
            });
        }

        if (storedData.otp !== otp) {
            return res.json({
                success: false,
                message: "Invalid OTP"
            });
        }

        return res.json({
            success: true,
            message: "OTP verified successfully!"
        });

    } catch (error) {
        return res.json({
            success: false,
            message: "Server error"
        });
    }
};

export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: 'All fields are required' });
    }

    try {
        const storedData = otpStore.get(email);
        if (!storedData || storedData.otp !== otp) {
            return res.json({
                success: false,
                message: "Invalid OTP"
            });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        otpStore.delete(email);

        return res.json({
            success: true,
            message: "Password reset successfully!"
        });

    } catch (error) {
        return res.json({
            success: false,
            message: "Failed to reset password"
        });
    }
};

// ======================== DOCTOR AUTHENTICATION ========================

export const doctorRegister = async (req, res) => {
    const { name, email, password, phone, specialization, degree, experience, fees } = req.body;

    if (!name || !email || !password) {
        return res.json({ success: false, message: 'Name, Email and Password are required' });
    }

    try {
        const existingDoctor = await doctorModel.findOne({ email });
        if (existingDoctor) {
            return res.json({ success: false, message: "Doctor already exists with this email" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const doctorData = {
            name,
            email,
            password: hashedPassword,
            phone: phone || '',
            specialization: specialization || 'cardiologist',
            degree: degree || 'MBBS',
            experience: experience || 0,
            fees: fees || 500,
            address: {
                street: '',
                city: '',
                state: '',
                pincode: '',
                country: 'India'
            }
        };

        const newDoctor = new doctorModel(doctorData);
        const doctor = await newDoctor.save();

        try {
            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: email,
                subject: 'Welcome to PULSE - Doctor Registration Successful',
                text: `Dear Dr. ${name},\n\nWelcome to PULSE medical platform! Your doctor account has been created successfully.\n\nEmail: ${email}\n\nYou can now login to access your doctor dashboard.\n\nBest regards,\nPULSE Team`
            };
            await transporter.sendMail(mailOptions);
            console.log(`Welcome email sent to doctor: ${email}`);
        } catch (emailError) {
            console.error('Doctor welcome email failed:', emailError);
        }

        return res.json({ 
            success: true, 
            message: "Doctor account created successfully! Please login to continue." 
        });

    } catch (error) {
        console.error('Doctor registration error:', error);
        return res.json({ success: false, message: error.message });
    }
};

export const doctorLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: 'Email and Password are required' });
    }

    try {
        const doctor = await doctorModel.findOne({ email });

        if (!doctor) {
            return res.json({ success: false, message: "Doctor not found with this email" });
        }

        const isMatch = await bcrypt.compare(password, doctor.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid password" });
        }

        const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        const doctorData = {
            id: doctor._id,
            name: doctor.name,
            email: doctor.email,
            phone: doctor.phone,
            specialization: doctor.specialization,
            degree: doctor.degree,
            experience: doctor.experience,
            fees: doctor.fees,
            available: doctor.available,
            rating: doctor.rating,
            totalReviews: doctor.totalReviews
        };

        return res.json({ 
            success: true, 
            message: "Doctor logged in successfully!",
            token,
            doctorData
        });

    } catch (error) {
        console.error('Doctor login error:', error);
        return res.json({ success: false, message: error.message });
    }
};

export const doctorLogout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        });

        return res.json({ success: true, message: "Doctor logged out successfully" });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

export const isDoctorAuthenticated = async (req, res) => {
    try {
        const doctorId = req.doctorId; 
        
        if (!doctorId) {
            return res.json({ success: false, message: "Not authenticated" });
        }

        const doctor = await doctorModel.findById(doctorId).select('-password');
        
        if (!doctor) {
            return res.json({ success: false, message: "Doctor not found" });
        }

        return res.json({ 
            success: true, 
            message: "Doctor authenticated",
            doctorData: doctor
        });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// ======================== DOCTOR PASSWORD RESET ========================

export const sendDoctorResetOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.json({ success: false, message: 'Email is required' });
    }

    try {
        const doctor = await doctorModel.findOne({ email });
        if (!doctor) {
            return res.json({ success: false, message: "Doctor with this email doesn't exist" });
        }

        const otp = generateOTP();
        
        // Use different key for doctor OTP to avoid conflicts
        otpStore.set(`doctor_${email}`, {
            otp,
            expires: Date.now() + 5 * 60 * 1000,
            attempts: 0
        });

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Doctor Password Reset OTP - PULSE',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Doctor Password Reset OTP</h2>
                    <p>Dear Dr. ${doctor.name},</p>
                    <p>Your OTP for password reset is:</p>
                    <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
                        <h1 style="color: #007bff; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
                    </div>
                    <p>This OTP is valid for 5 minutes only.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                    <p>Best regards,<br>PULSE Team</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        return res.json({
            success: true,
            message: "OTP sent to your doctor email successfully!"
        });

    } catch (error) {
        console.error('Doctor reset OTP error:', error);
        return res.json({
            success: false,
            message: "Failed to send OTP. Please try again."
        });
    }
};

export const verifyDoctorResetOtp = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.json({ success: false, message: 'Email and OTP are required' });
    }

    try {
        const storedData = otpStore.get(`doctor_${email}`);
        if (!storedData) {
            return res.json({
                success: false,
                message: "OTP expired or invalid"
            });
        }

        if (Date.now() > storedData.expires) {
            otpStore.delete(`doctor_${email}`);
            return res.json({
                success: false,
                message: "OTP has expired"
            });
        }

        if (storedData.otp !== otp) {
            return res.json({
                success: false,
                message: "Invalid OTP"
            });
        }

        return res.json({
            success: true,
            message: "OTP verified successfully!"
        });

    } catch (error) {
        console.error('Doctor verify OTP error:', error);
        return res.json({
            success: false,
            message: "Server error"
        });
    }
};

export const resetDoctorPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: 'All fields are required' });
    }

    try {
        const storedData = otpStore.get(`doctor_${email}`);
        if (!storedData || storedData.otp !== otp) {
            return res.json({
                success: false,
                message: "Invalid or expired OTP"
            });
        }

        if (Date.now() > storedData.expires) {
            otpStore.delete(`doctor_${email}`);
            return res.json({
                success: false,
                message: "OTP has expired"
            });
        }

        const doctor = await doctorModel.findOne({ email });
        if (!doctor) {
            return res.json({
                success: false,
                message: "Doctor not found"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        doctor.password = hashedPassword;
        await doctor.save();

        // Clear OTP after successful password reset
        otpStore.delete(`doctor_${email}`);

        // Send confirmation email
        try {
            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: email,
                subject: 'Password Reset Successful - PULSE',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #28a745;">Password Reset Successful</h2>
                        <p>Dear Dr. ${doctor.name},</p>
                        <p>Your password has been reset successfully.</p>
                        <p>If you didn't make this change, please contact our support team immediately.</p>
                        <p>Best regards,<br>PULSE Team</p>
                    </div>
                `
            };
            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.error('Password reset confirmation email failed:', emailError);
        }

        return res.json({
            success: true,
            message: "Doctor password reset successfully!"
        });

    } catch (error) {
        console.error('Doctor password reset error:', error);
        return res.json({
            success: false,
            message: "Failed to reset password"
        });
    }
};

// ======================== DEVELOPMENT UTILITIES ========================

export const sendTestEmail = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.json({ success: false, message: 'Email is required' });
    }

    try {
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Test Email - PULSE Medical Platform',
            text: `This is a test email from PULSE medical platform. Email sent to: ${email}`
        };
        await transporter.sendMail(mailOptions);

        return res.json({ success: true, message: 'Test email sent successfully!' });

    } catch (error) {
        console.error('Test email error:', error);
        return res.json({ success: false, message: error.message });
    }
};
