const cron = require('node-cron');
const schedule = require('node-schedule');
const axios = require('axios');
const Bull = require('bull');
const messageJob = require('./../models/job')
const Alert = require('./../models/alert')

const notificationQueue = new Bull('notifications', {
    redis: { host: process.env.REDIS_IP , port: process.env.REDIS_PORT } 
  });
  

const sendNotification = async (appointment) => {
    console.log(`Sending notification for appointment with ID: ${appointment.id}`);
    try {
        
        const alert = await messageJob.findOne({ id: appointment.id, status: 'upcoming' });
    
        if (!alert) {
          console.error(`Alert with jobId ${appointment.id} not found`);
          return;
        }
    
        
        const requestOptions = {
            method: 'post',
            url: `http://${process.env.WPPSERVER}:21465/api/${process.env.WPPSESSION_NAME}/send-message`,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.WPPSESSION_TOKEN}`
            },
            data: {
              phone: appointment.phoneNumber,
              message: appointment.message,
              isGroup: false
            }
          };
      
         
          const response = await axios(requestOptions);
      
         
          if (response.status === 201) {
            alert.status = 'sent';
            // await messageJob.findByIdAndDelete(appointment.alertId).exec();
          } else {
            console.log(response.status)
            alert.status = 'failed';
          }
      
          await alert.save();
          console.log(`Notification status updated for message job with ID ${appointment.id}`);
      } catch (error) {
        console.error('Error in sendNotification:', error);
      }
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
            oneHourJobId: oneHourJob.name,
            phoneNumber: appointment.phoneNumber,
            message: appointment.message,
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
    const appointments = await messageJob.find({status: 'upcoming'});
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

