import mongoose from 'mongoose'

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,   
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        default: '' 
    },
    specialization: {
        type: String,
        default: 'cardiologist', 
        enum: ['cardiologist', 'Dermatologist', 'Neurologist', 'Gynecologist', 'Eye Specialist', 'Dentist', 'Oncologist'] 
    },
    degree: {
        type: String,
        default: 'MBBS'
    },
    experience: {
        type: Number,
        default: 0
    },
    address: {
        street: { type: String, default: '' },
        city: { type: String, default: '' },
        state: { type: String, default: '' },
        pincode: { type: String, default: '' },
        country: { type: String, default: "India" }
    },
    fees: {
        type: Number,
        default: 500 
    },
    available: {
        type: Boolean,
        default: true
    },
    workingdays: {
        type: [String],
        default: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], 
        enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] 
    },
    slot_booked: {
        type: Object,
        default: {}
    },
       availableSlots: {
        type: [String],
        default: []
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalReviews: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

const doctorModel = mongoose.models.doctor || mongoose.model('doctor', doctorSchema);
export default doctorModel;
