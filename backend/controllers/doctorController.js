const asyncHandler = require('express-async-handler');
const {body, validationResult} = require('express-validator');
const Doctor = require('./../models/doctor');


/**
 * This module defines the controller methods for handling CRUD operations on Doctor records in an Express.js application.
 * These methods are designed for use in an admin panel, allowing administrators to:
 * - Retrieve all doctors associated with a specific client.
 * - Retrieve a specific doctor by ID.
 * - Create a new doctor record.
 * - Update an existing doctor record.
 * - Delete a doctor record.
 *
 * Methods:
 * - getAllDoctors: Retrieves all doctors associated with a specific client ID.
 * - getDoctorById: Retrieves a specific doctor by their ID.
 * - createDoctor: Creates a new doctor record.
 * - updateDoctor: Updates an existing doctor record.
 * - deleteDoctor: Deletes a doctor record by ID.
 * 
 * Error Handling:
 * Each method includes error handling to log errors and send corresponding HTTP status codes and messages to the client.
 */
//FOR ADMIN PANEL

exports.getAllDoctors = asyncHandler(
    async(req, res, next)=>{
        const allDoctors = await Doctor.find({clientId: req.params.id}).exec().catch((err)=>{
            console.log(`${req.params.id}: Client encountered errors while fetching doctors`);
            console.log(`ERRORS: ${err}`);
            return res.status(500).json({message: "Encountered error while fetching records for a client"});
        })

        if(!allDoctors){
            console.log(`${req.params.id}: Does not have any doctors.`);
            return res.status(404).json({message: "Doctors not found"});
        }

        res.status(200).json(allDoctors);
        console.log(`SUCCESS: ${req.params.id} all doctors fetched`);
    }
)

exports.getDoctorById = asyncHandler(
    async(req, res, next)=>{
        const doctor = await Doctor.findById(req.params.id).exec().catch((err)=>{
            console.log(`${req.params.id}: Error encountere while fetching doctor`);
            console.log(`ERROR: ${err}`);
            return res.status(500).json({message: "Error encountered while fetching doctor by Id"});
        })

        if(!doctor){
            console.log(`${req.params.id}: Doctor not found`)
            return res.status(404).json({message: "Doctor not found"});
        }

        res.status(200).json(doctor)
    }
)


exports.createDoctor = asyncHandler(
    async(req, res, next)=>{
        const doctor = new Doctor({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phoneNumber: req.body.phoneNumber,
            clientId: req.body.clientId,
        })


        await doctor.save().catch((err)=>{
            console.log(`${req.body.clientId}: Client encountered while creating doctor`);
            console.log(`ERROR: ${err}`);
            return res.status(500).json({message: "Encountered error while creating doctor"});
        })

        res.status(200).json({message: "Doctor created successfully"});
    }
)


exports.updateDoctor = asyncHandler(
    async(req, res, next)=>{
        const doctor = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phoneNumber: req.body.phoneNumber,
        }

        await Doctor.findByIdAndUpdate(req.params.id, doctor).exec().catch((err)=>{
            console.log(`${req.body.clientId}: Client's \n ${req.params.id} Update encountered error`);
            console.log(`Update Doctor Object: ${doctor}`);
            return res.status(500).json({message: "Encountered error while updating"});
        })


        res.status(200).json({message: 'Doctor details updated successfully'});
    }
)



exports.deleteDoctor = asyncHandler(
    async(req, res, next)=>{

        await Doctor.findByIdAndDelete(req.params.id).exec().catch((err)=>{
            console.log(`${req.params.id}: Doctor encountered error while deleting`);
            return res.status(500).json({message: "Encountered error while deleting doctor"});

        })


        res.status(200).json({messge: "Doctor deleted successfully"});
    }
)