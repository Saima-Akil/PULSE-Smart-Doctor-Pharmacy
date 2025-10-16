import express from 'express'
import userAuth from '../middleware/userAuth.js'
import doctorAuth from '../middleware/doctorAuth.js'
import {bookAppointment,getDoctorAppointments,updateAppointmentStatus,getAvailableSlots} from '../controllers/appointmentController.js'

const router = express.Router();

router.post('/book', userAuth, bookAppointment)
router.get('/doctor-appointments', doctorAuth, getDoctorAppointments)
router.post('/update-status', doctorAuth, updateAppointmentStatus)
router.get('/available-slots', getAvailableSlots)

export default router;
