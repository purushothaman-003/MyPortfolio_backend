const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

// POST route to submit form data
router.post('/submit', async (req, res) => {
    const { name, email, message } = req.body;

    try {
        // Save to MongoDB
        const newContact = new Contact({ name, email, message });
        await newContact.save();

        // Send email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: process.env.EMAIL,
            subject: 'New Contact Form Submission',
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Form submitted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
