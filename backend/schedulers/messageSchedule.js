const cron = require('node-cron');
const schedule = require('node-schedule');
const Bull = require('bull');
const messageJob = require('./../models/job')

const notificationQueue = new Bull('notifications', {
    redis: { host: process.env.REDIS_IP , port: process.env.REDIS_PORT } 
  });
  
// Function to send notification
const sendNotification = (appointment) => {
    console.log(`Sending notification for appointment with ID: ${appointment.id}`);
    // Logic to send notification (e.g., email, SMS)
};


notificationQueue.process(async (job) => {
        sendNotification(job.data.appointment);
    });


const scheduleNotifications = async (appointment) => {
    const oneDayBefore = new Date(appointment.date.getTime() - 24 * 60 * 60 * 1000);
    const oneHourBefore = new Date(appointment.date.getTime() - 60 * 60 * 1000);


    const oneDayJob = schedule.scheduleJob(oneDayBefore, () => {
        notificationQueue.add({ appointment });
    });


    const oneHourJob = schedule.scheduleJob(oneHourBefore, () => {
        notificationQueue.add({ appointment });
    });

    if (oneDayBefore < new Date() || oneHourBefore < new Date()) {
        console.error('Failed to schedule jobs: Notification times are in the past');
        return 0;
      }

    if(oneDayJob && oneHourJob){

        const newAlert = new messageJob({
            id: appointment.id,
            date: appointment.date,
            oneDayJobId: oneDayJob.name,
            oneHourJobId: oneHourJob.name
        });
        console.log(oneDayJob.name, oneHourJob.name)
        
        await newAlert.save();
        console.log(`Scheduled notifications for appointment with ID: ${appointment.id}`);

        return appointment.id;
    }else {
        console.error('Failed to schedule jobs');
        return -1;
    }

    

    
};



const cancelNotifications = async (appointmentId) => {
const appointment = await messageJob.findOne({ id: appointmentId });
if (appointment) {
    schedule.cancelJob(appointment.oneDayJobId);
    schedule.cancelJob(appointment.oneHourJobId);
    await messageJob.deleteOne({ id: appointmentId });
    console.log(`Canceled notifications for appointment with ID: ${appointmentId}`);
}
};


const reloadAndRescheduleJobs = async () => {
    const appointments = await messageJob.find({});
    appointments.forEach(appointment => {
        const oneDayBefore = new Date(appointment.date.getTime() - 24 * 60 * 60 * 1000);
        const oneHourBefore = new Date(appointment.date.getTime() - 60 * 60 * 1000);

        
        const oneDayJob = schedule.scheduleJob(appointment.oneDayJobId, oneDayBefore, () => {
            notificationQueue.add({ appointment });
        });

        
        const oneHourJob = schedule.scheduleJob(appointment.oneHourJobId, oneHourBefore, () => {
            notificationQueue.add({ appointment });
        });
    });
    console.log('Rescheduled all jobs on restart');
};

module.exports = {
    scheduleNotifications,
    reloadAndRescheduleJobs,
    cancelNotifications,
}

