import nodemailer from "nodemailer";
import logger from "./logger.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendPurchaseEmail = async (to, ticket) => {
  const mailOptions = {
    from: "acoderhouse@gmail.com",
    to: to,
    subject: "Confirmación de Compra",
    text: `Gracias por tu compra. Aquí están los detalles de tu compra:\n\nCódigo: ${ticket.code}\nFecha: ${ticket.purchase_datetime}\nMonto: $${ticket.amount}\n\nGracias por comprar con nosotros.`,
    html: `<h1>Gracias por tu compra</h1><p>Aquí están los detalles de tu compra:</p><p>Código: ${ticket.code}</p><p>Fecha: ${ticket.purchase_datetime}</p><p>Monto: $${ticket.amount}</p><p>Gracias por comprar con nosotros.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info("Correo de confirmación enviado");
  } catch (error) {
    logger.error("Error al enviar el correo de confirmación:", error);
    throw error;
  }
};

export const sendResetPasswordEmail = async (to, resetUrl) => {
  const mailOptions = {
    from: "acoderhouse@gmail.com",
    to: to,
    subject: "Restablecer Contraseña",
    text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetUrl}`,
    html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p><a href="${resetUrl}">Restablecer Contraseña</a>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info("Correo de restablecimiento enviado");
  } catch (error) {
    logger.error("Error al enviar el correo de restablecimiento:", error);
    throw error;
  }
};

export const sendNotificationEmail = async (email, productTitle) => {
  const mailOptions = {
    from: "acoderhouse@gmail.com",
    to: email,
    subject: "Notificación de eliminación de producto",
    text: `Tu producto "${productTitle}" ha sido eliminado por el administrador.`,
    html: `<p>Tu producto "${productTitle}" ha sido eliminado por el administrador"</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(
      `Correo enviado a ${email} notificando sobre la eliminación del producto.`
    );
  } catch (error) {
    logger.error("Error al enviar el correo:", error);
    throw error;
  }
};

export const sendInactivityEmail = async (email) => {
  const mailOptions = {
    from: "acoderhouse@gmail.com",
    to: email,
    subject: "Cuenta eliminada por inactividad",
    text: `Tu cuenta ha sido eliminada debido a la inactividad en los últimos 30 minutos.`,
    html: `<p>Tu cuenta ha sido eliminada debido a la inactividad en los últimos 30 minutos.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`Correo enviado a ${email} por inactividad.`);
  } catch (error) {
    logger.error("Error al enviar el correo por inactividad:", error);
    throw error;
  }
};
