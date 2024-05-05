import nodemailer from 'nodemailer';
import moment from 'moment-timezone';
import cron from 'node-cron'
async function sendEmail(to, subject, content) {
    
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.nodeMailerEmail, // generated ethereal user
            pass: process.env.nodeMailerPassword, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: ` < ${process.env.nodeMailerEmail}>`, // sender address
        to, // list of receivers
        subject, // Subject line
        html:content, // html body
      
    });
    console.log('Email sent: ' + info.response);
    return info
   
}













export const scheduleAppointmentReminders = async (selectedTimeSlot, user, doctor) => {
    try {
        // Get the appointment time and calculate the time one hour before it
        const appointmentTime = moment(selectedTimeSlot).tz('Asia/Gaza');
        console.log(appointmentTime);
        const formattedDateTime = appointmentTime.format('YYYY-MM-DD HH:mm:ss');
console.log(formattedDateTime);
        const reminderTime = moment(appointmentTime).subtract(1, 'hour');
        const formattedDateTimee = reminderTime.format('YYYY-MM-DD HH:mm:ss');
console.log(formattedDateTimee);

console.log(reminderTime);
        // Schedule a cron job to send the reminder
        cron.schedule(reminderTime.format('m H D M d'), async () => {
            try {
                // Construct email content
                const content = 'Your appointment is scheduled in one hour.';

                // Send reminder emails
                await sendEmail(user.email, 'Appointment Reminder', content);
                await sendEmail(doctor.email, 'Appointment Reminder', content);
            } catch (error) {
                console.error('Error sending appointment reminder:', error);
            }
        });
    } catch (error) {
        console.error('Error scheduling appointment reminders:', error);
    }
};