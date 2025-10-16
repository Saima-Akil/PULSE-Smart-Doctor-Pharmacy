import appointmentModel from '../models/appointmentModel.js'
import doctorModel from '../models/doctorModel.js'
import userModel from '../models/userModel.js'

export const getAvailableSlots = async (req, res) => {
    try {
        const { doctorId, date } = req.query;

        console.log('getAvailableSlots:', { doctorId, date });

        if (!doctorId || !date) {
            return res.json({ success: false, message: "Doctor ID and date are required" });
        }

        const doctor = await doctorModel.findById(doctorId);
        if (!doctor) {
            console.log('Doctor not found');
            return res.json({ success: false, message: "Doctor not found" });
        }

        console.log('Doctor found:', doctor.name);
        console.log('Doctor available slots:', doctor.availableSlots);


        let allSlots = doctor.availableSlots || [];

        if (allSlots.length === 0) {
            console.log('No slots, using default slots');
            allSlots = [
                '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
                '14:00', '15:00', '15:30', '16:00', '16:30',
                '17:00', '17:30', '18:00'
            ];
            
            try {
                await doctorModel.findByIdAndUpdate(doctorId, { availableSlots: allSlots });
                console.log('Default slots saved to doctor profile');
            } catch (saveError) {
                console.log('Could not save default slots:', saveError);
            }
        }

        const bookedSlots = doctor.slot_booked[date] || [];
        console.log('📅 Booked slots from doctor:', bookedSlots);
        const confirmedAppointments = await appointmentModel.find({
            doctorId,
            appointmentDate: new Date(date),
            status: { $in: ['pending', 'confirmed'] }
        });

        const bookedTimes = confirmedAppointments.map(app => app.appointmentTime);
        console.log('📋 Booked from appointments:', bookedTimes);

        const allBookedSlots = [...bookedSlots, ...bookedTimes];
        const uniqueBookedSlots = [...new Set(allBookedSlots)];
        const availableSlots = allSlots.filter(slot => !uniqueBookedSlots.includes(slot));

        console.log('✅ Final available slots:', availableSlots);

        res.json({
            success: true,
            availableSlots: availableSlots.sort(),
            bookedSlots: uniqueBookedSlots.sort(),
            totalSlots: allSlots.length,
            availableCount: availableSlots.length
        });

    } catch (error) { 
        console.error("getAvailableSlots error:", error);
        res.json({ success: false, message: error.message });
    }
};
export const bookAppointment = async (req, res) => {
    try {
        const userId = req.userId;
        const {
            doctorId,
            patientName,
            patientPhone,
            patientEmail,
            age,
            gender,
            appointmentDate,
            appointmentTime,
            symptoms,
            isEmergency
        } = req.body;

        console.log('📝 Booking appointment:', { doctorId, appointmentTime, appointmentDate });
        if (!doctorId || !patientName || !patientPhone || !patientEmail || !age || !gender || !appointmentDate || !appointmentTime) {
            return res.json({ success: false, message: "All fields are required" });
        }

        const doctor = await doctorModel.findById(doctorId);
        if (!doctor) {
            return res.json({ success: false, message: "Doctor not found" });
        }

        if (!doctor.available) {
            return res.json({ success: false, message: "Doctor is not available" });
        }

        let doctorSlots = doctor.availableSlots || [];
        if (doctorSlots.length === 0) {
            doctorSlots = [
                '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
                '14:00','15:00', '15:30', '16:00', '16:30',
                '17:00', '17:30', '18:00'
            ];
        }

        if (!doctorSlots.includes(appointmentTime)) {
            return res.json({ success: false, message: "Selected time slot is not available" });
        }
        const existingAppointment = await appointmentModel.findOne({
            doctorId,
            appointmentDate: new Date(appointmentDate),
            appointmentTime,
            status: { $in: ['pending', 'confirmed'] }
        });

        if (existingAppointment) {
            return res.json({ success: false, message: "This time slot is already booked" });
        }
        const appointmentData = {
            userId,
            doctorId,
            patientName,
            patientPhone,
            patientEmail,
            age: Number(age),
            gender,
            appointmentDate: new Date(appointmentDate),
            appointmentTime,
            symptoms: symptoms || '',
            consultationFees: doctor.fees,
            isEmergency: isEmergency || false
        };

        const newAppointment = new appointmentModel(appointmentData);
        const savedAppointment = await newAppointment.save();
        const dateKey = appointmentDate;
        if (!doctor.slot_booked[dateKey]) {
            doctor.slot_booked[dateKey] = [];
        }
        doctor.slot_booked[dateKey].push(appointmentTime);
        await doctor.save();

        console.log('Appointment booked successfully:', savedAppointment._id);

        res.json({
            success: true,
            message: "Appointment booked successfully!",
            appointmentId: savedAppointment._id
        });

    } catch (error) { 
        console.log("bookAppointment error:", error);
        res.json({ success: false, message: error.message });
    }
};
export const getDoctorAppointments = async (req, res) => {
    try {
        const doctorId = req.doctorId;

        const appointments = await appointmentModel
            .find({ doctorId })
            .populate('userId', 'name email')
            .sort({ appointmentDate: -1 });

        const appointmentsData = appointments.map(appointment => ({
            id: appointment._id,
            patientName: appointment.patientName,
            patientPhone: appointment.patientPhone,
            patientEmail: appointment.patientEmail,
            age: appointment.age,
            gender: appointment.gender,
            appointmentDate: appointment.appointmentDate,
            appointmentTime: appointment.appointmentTime,
            symptoms: appointment.symptoms,
            status: appointment.status,
            consultationFees: appointment.consultationFees,
            paymentStatus: appointment.paymentStatus,
            doctorNotes: appointment.doctorNotes,
            prescription: appointment.prescription,
            isEmergency: appointment.isEmergency,
            createdAt: appointment.createdAt
        }));

        res.json({
            success: true,
            appointments: appointmentsData,
            count: appointmentsData.length
        });

    } catch (error) {
        console.log("getDoctorAppointments error:", error);
        res.json({ success: false, message: error.message });
    }
};
export const updateAppointmentStatus = async (req, res) => {
    try {
        const doctorId = req.doctorId;
        const { appointmentId, status, doctorNotes, prescription } = req.body;

        if (!appointmentId || !status) {
            return res.json({ success: false, message: "Appointment ID and status are required" });
        }

        const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
        if (!validStatuses.includes(status)) {
            return res.json({ success: false, message: "Invalid status" });
        }

        const appointment = await appointmentModel.findOne({
            _id: appointmentId,
            doctorId: doctorId
        });

        if (!appointment) {
            return res.json({ success: false, message: "Appointment not found" });
        }

        const updateData = { status };
        if (doctorNotes) updateData.doctorNotes = doctorNotes;
        if (prescription) updateData.prescription = prescription;

        const updatedAppointment = await appointmentModel.findByIdAndUpdate(
            appointmentId,
            updateData,
            { new: true }
        );

        res.json({
            success: true,
            message: "Appointment updated successfully"
        });

    } catch (error) { 
        console.log("updateAppointmentStatus error:", error);
        res.json({ success: false, message: error.message });
    }
};
