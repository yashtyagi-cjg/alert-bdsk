const asyncHandler = require('express-async-handler');
const {body, validationResult} = require('express-validator');
const Patient = require('./../models/patient')

/*ASSUMPTION: Auth status maintained over sessions and deserialized. It will 
store it in req.user . IF this changes, then we'll have to make similar 
changes as client details are logical access control while fetching data. */

/**
 * TO BE IMPLEMENTED:
    * {body, validationReslut} implementation to be implemented later on 



 * ENDPOINTS IMPLEMENTED
        * 1. getAll: Fetch all patients
        * 2. getPatientsById: Fetch a patient based on req.params.id
        * 3. updatePatientById: Update patient based on req.params.id
        * 4. createPatient: Create a new patient
        * 5. deletePatientById: Delete patient based on req.params.id (NOT SURE ABOUT ACCESS CONTROL ON THIS)
 */


//Endpoint to get all the patients associated with a client id
exports.getAll = asyncHandler(
    async(req, res, next)=>{
        const patients = await Patient.find({
            clientId: req.user._id
        }).exec();

        if(!patients){
            console.log(`${req.user.id}: Does not have patients in records`)
            return res.status(404).json({message: "No patients available for this client"});
        }

        const allPatients = patients.map((patient)=>{
            return {
                patientId: patient._id,
                firstName: patient.firstName,
                lastName: patient.lastName,
                mobileNumber: patient.mobileNumber,
                dob: patient.dob,
            }
        })

        res.status(200).json(allPatients);
    }
)


//GET patient details for a specific patient 
exports.getPatientById = asyncHandler(
    async(req, res, next)=>{
        const patient = await Patient.findById(req.params.id).exec();

        if(!patient){
            console.log(`${req.user.id}: Does not have patient : ${req.params.id}`)
            return res.status(404).json({message: `No patient available for the following patient id: ${req.params.id}`})
        }

        res.status(200).json({
            patientId: patient._id,
            firstName: patient.firstName,
            lastName: patient.lastName,
            mobileNumber: patient.mobileNumber,
            dob: patient.dob,
        })
    }
)


//Update patient details using patient id
exports.updatePatientById = asyncHandler(
    async(req, res, next)=>{
        const patient = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            mobileNumber: req.body.mobileNumber,
            dob: req.body.dob,
        }

       
        await Patient.findByIdAndUpdate(req.params.id, patient).exec().catch((err)=>{
            console.log(`${req.user._id}: Encountered error while updating: Patient ${req.body._id}`)
            console.log(`ERROR ${err}`);
            return res.status(500).json({message: "Encounterd error while processign"});
        })

       res.status(200).json("Patient details updated successfully");
    }
)


//Creating a new patient document 
//Express-validation to be implemented
exports.createPatient = asyncHandler(
    async(req, res, next)=>{
        const patient = new Patient({
            clientId: req.user.id,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            mobileNumber: req.body.mobileNumber,
            dob: req.body.dob,
        })


        await patient.save().catch((err)=>{
            console.log(`${req.user.id}: Encountered error while creating a new patient`);
            console.log(`Patient: ${patient}`);
            console.log(`ERROR: ${err}`);

            return res.status(500).json({message: "Encountered error while creating the new patient"});
        })

        res.status(200).json({message: "Patient created successfully"})
    }
)


//NOT SURE ABOUT GIVING Functionality to delete patients
exports.deletePatientById = asyncHandler(
    async(req, res, next)=>{
        
        await Patient.findByIdAndDelete(req.params.id).execute().catch((err)=>{
            console.log(`${req.user.id}: Encountered error while deleting: Patient ${req.params.id}`);
            console.log(`ERROR: ${err}`);
            return res.status(500).json({message: `Delete user ${req.params.id} unsuccessful`})
        })

        return res.status(200).json({message: `Delete user ${req.params.id} successfull`});
    }
)