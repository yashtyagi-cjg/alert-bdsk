const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Appointment = require("./../models/appointment");
const { scheduler } = require("./../backend/schedulers/messageSchedule.js")


/**
 * Create a new Appointment
 * @async
 * @function createAppointment
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
exports.createAppointment = asyncHandler(async (req, res, next) => {
    const appointment = new Appointment({
        patientId: req.body.patientId._id,
        date: req.body.date,
        clientId: req.body.clientId._id,
        // alertId: req.body.alertId,
        message: `Hi, I am Ramanujan, here to remind you about your upcoming appointment with ${req.body.clientId.name} 
        @${req.body.date}.`,
        status: req.body.status,
    });
    const argAppointment = {
        id: req.body.clientId._id,
        date: req.body.clientId.date,
        phoneNumber: req.body.clientId.phoneNumber,
        message: req.body.clientId.message,
    }
    // Exception handling to be added for scheduleNotifications 
    await appointment.save().then(() => {
        scheduler.scheduleNotifications(argAppointment)
    }).catch((err) => {
        console.log(`ERROR while creating Appointment: ${appointment}`);
        console.log(`ERROR: ${err}`);
    });

    res.status(200).json({ message: "Successfully Created Appointment" });
    console.log(`SUCCESS: APPOINTMENT CREATED`);
});

/**
 * Get all Appointments
 * @async
 * @function getAllAppointments
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
exports.getAllAppointments = asyncHandler(async (req, res, next) => {
    const allAppointments = await Appointment.find({}).populate('clientId').populate('patientId').exec().catch((err) => {
        console.log("ERROR While fetching all appointments");
        console.log(`ERROR: ${err}`);
        return res.status(500).json({ message: "Error encountered while fetching all appointments" });
    });

    if (!allAppointments) {
        return res.status(404).json({ message: "No appointment found." });
    }

    // const allAppointmentsFormatted = allAppointments.map((appointment) => {
    //     return {
    //         _id: appointment._id,
    //         patientId: req.body.patientId,
    //         date: req.body.date,
    //         clientId: req.body.clientId,
    //         alertId: req.body.alertId,
    //         status: req.body.status,
    //     }
    // })

    res.status(200).json(allAppointmentsFormatted);
    console.log(`SUCCESS: GET ALL APPOINTMENTS`);
});


/**
 * Get Appointment by ID
 * @async
 * @function getAppointmentByID
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
exports.getAppointmentByID = asyncHandler(async (req, res, next) => {
    const appointment = await Appointment.findByID(req.params.id).populate('clientId').populate('patientId').exec()
        .catch((err) => {
            console.log(`${req.params.id}: Error encountered while fetching appointment`);
            console.log(`ERROR: ${err}`);
            return res.status(500).json({ message: "Error encountered while fetching appointment by ID" });
        });

    if (!appointment) {
        console.log(`${req.params.id}: Appointment not found`);
        return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json(appointment);
});


/**
 * Update an Appointment
 * @async 
 * @function updateAppointment
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
exports.updateAppointment = asyncHandler(
    async (req, res, next) => {
        const appointment = {
            patientId: req.body.patientId._id,
            date: req.body.date,
            clientId: req.body.clientId._id,
            // alertId: req.body.alertId,
            message: `Hi, I am Ramanujan, here to remind you about your upcoming appointment with ${req.body.clientId.name} @${req.body.date}.`,
            status: req.body.status,
        }

        const argAppointment = {
            id: req.body.clientId._id,
            date: req.body.clientId.date,
            phoneNumber: req.body.clientId.phoneNumber,
            message: req.body.clientId.message,
        }

        // Delete first, then Update the appointment in messageScheduler 

        await Appointment.findByIdAndDelete(req.params.id).exec().then(() => {
            scheduler.cancelNotifications(argAppointment)
        }).catch((err) => {
            console.log(`${req.params.id}: Error encountered while deleting appointment`);
            console.log(`ERROR: ${err}`);
            return res.status(500).json({ message: "Error encountered while deleting appointment" });
        });

        await appointment.save().then(() => {
            scheduler.scheduleNotifications(argAppointment)
        }).catch((err) => {
            console.log(`ERROR while creating Appointment: ${appointment}`);
            console.log(`ERROR: ${err}`);
        });

        res.status(200).json("Appointment details updated successfully");
    }
)


/**
 * Delete an Appointment by ID
 * @async
 * @function deleteAppointment
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
exports.deleteAppointment = asyncHandler(
    async (req, res, next) => {

        const argAppointment = {
            id: req.body.clientId._id,
            date: req.body.clientId.date,
            phoneNumber: req.body.clientId.phoneNumber,
            message: req.body.clientId.message,
        }

        await Appointment.findByIdAndDelete(req.params.id).exec().then(() => {
            scheduler.cancelNotifications(argAppointment)
        }).catch((err) => {
            console.log(`${req.params.id}: Error encountered while deleting appointment`);
            console.log(`ERROR: ${err}`);
            return res.status(500).json({ message: "Error encountered while deleting appointment" });
        });

        res.status(200).json({ message: "Appointment deleted successfully" });
        console.log(`SUCCESS: DELETE an Appointment ${req.params.id}`);
    }

)