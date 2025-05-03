import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";

// Get directory path for current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure dotenv with relative path to .env file
// Adjust the path according to your project structure
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Debugging step: log environment variables to ensure they're loaded correctly
console.log('User:', process.env.USER);
console.log('Pass:', process.env.PASS);

// Setup transporter with more specific Gmail settings
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: process.env.USER,
        pass: process.env.PASS
    }
});

// Generic function to send an email
export const sendEmail = async ({ to, subject, text, html }) => {
    const mailOptions = {
        from: process.env.USER,  // From Gmail address
        to,
        subject,
        text,
        html
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error.message);
        throw error;
    }
};