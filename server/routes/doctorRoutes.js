import express from 'express'
import doctorAuth from '../middleware/doctorAuth.js'
import { getDoctorData, updateDoctorProfile, getAllDoctors, getDoctorById } from '../controllers/doctorController.js'


const router = express.Router();
router.get('/doctordata', doctorAuth, getDoctorData)
router.put('/update-profile', doctorAuth, updateDoctorProfile)


router.get('/all', getAllDoctors)
router.get('/:doctorId', getDoctorById)

export default router;

