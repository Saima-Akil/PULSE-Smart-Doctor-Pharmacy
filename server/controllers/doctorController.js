import doctorModel from '../models/doctorModel.js'
export const getDoctorData = async (req, res) => {
    try {
        const doctorId = req.doctorId;
        if (!doctorId) {
            return res.json({ success: false, message: "Doctor Id not found in data" })
        }

        const doctor = await doctorModel.findById(doctorId)
        if (!doctor) { 
            return res.json({ success: false, message: "Doctor not found" })
        }

        const doctorData = {
            id: doctor._id,
            name: doctor.name,
            email: doctor.email,
            phone: doctor.phone,
            specialization: doctor.specialization,
            degree: doctor.degree,
            experience: doctor.experience,
            address: doctor.address,
            fees: doctor.fees, 
            available: doctor.available,
            workingdays: doctor.workingdays,
            slot_booked: doctor.slot_booked,
            rating: doctor.rating,
            totalReviews: doctor.totalReviews,
            availableSlots:doctor.availableSlots ||[]
        }

        res.json({ success: true, doctorData: doctorData })
    } catch (error) {
        console.log("getDoctorData error:", error);
        res.json({ success: false, message: error.message })
    }
}

export const updateDoctorProfile = async (req, res) => {
    try {
        const doctorId = req.doctorId; 
        const {
            name,
            phone,
            specialization,
            degree,
            experience,
            fees,
            address,
            workingdays,
            available,
            availableSlots
        } = req.body;

        if (!doctorId) {
            return res.json({ success: false, message: "Doctor ID not found" });
        }

        // Validate required fields
        if (!name || !phone || !specialization || !degree) {
            return res.json({ success: false, message: "Required fields missing" });
        }
          if (availableSlots && availableSlots.length === 0) {
            return res.json({ success: false, message: "Please select at least one time slot" });
        }

        const updateData = {
            name,
            phone,
            specialization,
            degree,
            experience: Number(experience),
            fees: Number(fees),
            address,
            workingdays: workingdays || [],
            available: available !== undefined ? available : true
        };

        const updatedDoctor = await doctorModel.findByIdAndUpdate(
            doctorId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedDoctor) {
            return res.json({ success: false, message: "Doctor not found" });
        }

        const doctorData = {
            id: updatedDoctor._id,
            name: updatedDoctor.name,
            email: updatedDoctor.email,
            phone: updatedDoctor.phone,
            specialization: updatedDoctor.specialization,
            degree: updatedDoctor.degree,
            experience: updatedDoctor.experience,
            address: updatedDoctor.address,
            fees: updatedDoctor.fees,
            available: updatedDoctor.available,
            workingdays: updatedDoctor.workingdays,
            slot_booked: updatedDoctor.slot_booked,
            rating: updatedDoctor.rating,
            totalReviews: updatedDoctor.totalReviews,
            availableSlots:updatedDoctor.availableSlots
        };

        res.json({
            success: true,
            message: "Profile updated successfully",
            doctorData: doctorData
        });

    } catch (error) {
        console.log("updateDoctorProfile error:", error);
        res.json({ success: false, message: error.message });
    }
};
export const getAllDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({ available: true }).select('-password');
        
        const doctorsData = doctors.map(doctor => ({
            id: doctor._id,
            name: doctor.name,
            specialization: doctor.specialization,
            degree: doctor.degree,
            experience: doctor.experience,
            fees: doctor.fees,
            address: doctor.address,
            workingdays: doctor.workingdays,
            rating: doctor.rating,
            totalReviews: doctor.totalReviews,
            available: doctor.available,
            availableSlots:doctor.availableSlots||[]
        }));

        res.json({
            success: true,
            doctors: doctorsData,
            count: doctorsData.length
        });

    } catch (error) {
        console.log("getAllDoctors error:", error);
        res.json({ success: false, message: error.message });
    }
};
export const getDoctorById = async (req, res) => {
    try {
        const { doctorId } = req.params;
        
        const doctor = await doctorModel.findById(doctorId).select('-password');
        
        if (!doctor) {
            return res.json({ success: false, message: "Doctor not found" });
        }

        const doctorData = {
            id: doctor._id,
            name: doctor.name,
            email: doctor.email,
            phone: doctor.phone,
            specialization: doctor.specialization,
            degree: doctor.degree,
            experience: doctor.experience,
            address: doctor.address,
            fees: doctor.fees,
            available: doctor.available,
            workingdays: doctor.workingdays,
            rating: doctor.rating,
            totalReviews: doctor.totalReviews,
            availableSlots:doctor.availableSlots
        };

        res.json({
            success: true,
            doctorData: doctorData
        });

    } catch (error) {
        console.log("getDoctorById error:", error);
        res.json({ success: false, message: error.message });
    }
};
