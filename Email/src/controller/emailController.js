import transporter from '../config/emailConfig.js';
import dotenv from 'dotenv';

dotenv.config();

export const sendEmail = async (req, res) => {
    const {to, subject, text} = req.body;
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            template: 'email',
            context: {nombre: text, mensaje: "Bienvenido a la familia"}
        });
        return res.json({ message : 'Correo enviado con exito'}); 
    } catch (error) {
        return res.status(500).json({ error: error.message})
    }
}

