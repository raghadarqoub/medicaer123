import User from "../models/UserSchema.js";
import Booking from "../models/BookingSchema.js";
import Doctor from "../models/DoctorSchema.js";
import Stripe from "stripe";
import nodemailer from 'nodemailer';
import moment from 'moment-timezone';
import cron from 'node-cron';
import moments from 'moment'


async function sendEmail(recipientEmail, subject, content,recipientName = '') {
    
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.nodeMailerEmail, // generated ethereal user
            pass: process.env.nodeMailerPassword, // generated ethereal password
        },
    });
    let personalizedContent = content;
    if (recipientName) {
        personalizedContent = `Dear ${recipientName},\n\n${content}\n\nRegards,\nYour HealthCare Team`;
    }


    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: ` < ${process.env.nodeMailerEmail}>`, // sender address
        to:recipientEmail, // list of receivers
        subject, // Subject line
        html:personalizedContent, // html body
      
    });
    console.log('Email sent: ' + info.response);
    return info
   
}
async function scheduleReminderEmail(appointmentStartTime, recipientEmail, recipientName) {
    try {
        // Calculate the reminder time (e.g., 1 hour before appointment)
        const reminderTime = moment(appointmentStartTime).subtract(1, 'hour');
        const codePattern=reminderTime.format('m H D M d');
console.log(reminderTime);
        // Schedule a cron job to send the reminder
        cron.schedule(codePattern, async () => {
            try {
                // Construct email content
                const subject = 'Appointment Reminder';
                const content = `Dear,\n\nYour appointment with ${recipientName} is in one hour.`;

                // Send reminder email
                await sendEmail(recipientEmail, subject, content);
            } catch (error) {
                console.error('Error sending reminder email:', error);
            }
        });

        console.log('Reminder scheduled successfully.');
    } catch (error) {
        console.error('Error scheduling reminder:', error);
    }
}


export const getCheckoutSession = async (req, res) => {
  
 
    try {
          //get currently booked doctor 
          console.log(req.body); // Log the entire request body
        const { selectedTimeSlot } = req.body; // Extract selectedTimeSlot from req.body
        console.log(selectedTimeSlot); // Log the extracted selectedTimeSlot

    const doctor = await Doctor.findById(req.params.doctorId);
    console.log(doctor);
    if (!doctor) {
        return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    const user = await User.findById(req.userId);
    console.log(user);
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (!user.email || !doctor.email) {
        return res.status(400).json({ success: false, message: 'User or doctor email is missing' });
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    //create STRIPE checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        success_url: `${process.env.CLIENT_SITE_URL}checkout-success`,
        cancel_url: `${req.protocol}://${req.get("host")}/doctors/${doctor._id}`,
        customer_email: user.email,
        client_reference_id:req.params.doctorId,
        line_items: [
            {
                price_data: {
                    currency: 'bdt',
                    unit_amount: doctor.ticketPrice * 100,
                    product_data: {
                        name: doctor.name,
                        description: doctor.bio,
                        images: [doctor.photo],

                    }
                },
                quantity: 1,
            }
        ]
    })
    //create new booking
    const booking = new Booking({
        doctor: doctor._id,
        user: user._id,
        ticketPrice: doctor.ticketPrice,
        session: session.id,
        selectedTimeSlot,
    })
    await booking.save();
    const formattedStartTime = moments(selectedTimeSlot.startingTime, 'HH:mm').format('YYYY-MM-DDTHH:mm:ss');

//     console.log(formattedStartTime);
//     const appointmentStartTime = new Date(formattedStartTime);
//  console.log(appointmentStartTime);

await scheduleReminderEmail(formattedStartTime, user.email, doctor.name);
await scheduleReminderEmail(formattedStartTime, doctor.email,user.name);

    // scheduleReminderEmail(formattedStartTime,doctor.email);
console.log(doctor.name);
    res
    .status(200)
    .json ({ success: true, message: "Successfully paid", session })

    } catch (err) {
        console.log(err);
        res
        .status(500).json({ success: false, message :'Error creating checkout session',err })
        
    }
}