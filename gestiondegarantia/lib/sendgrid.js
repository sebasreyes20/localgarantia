const sgMail = require('@sendgrid/mail');

// Asegúrate de configurar tu API key en las variables de entorno
if (!process.env.SENDGRID_API_KEY) {
  console.warn('⚠️ La variable de entorno SENDGRID_API_KEY no está configurada');
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Envía un correo electrónico usando SendGrid
 * @param {Object} options - Opciones del correo
 * @param {string} options.to - Destinatario del correo
 * @param {string} options.from - Remitente del correo
 * @param {string} options.subject - Asunto del correo
 * @param {string} options.text - Contenido del correo en texto plano
 * @param {string} options.html - Contenido del correo en HTML (opcional)
 */
async function sendEmail({ to, from, subject, text, html }) {
  try {
    const msg = {
      to,
      from,
      subject,
      text,
      html: html || text
    };

    await sgMail.send(msg);
    console.log('✅ Correo enviado exitosamente');
    return { success: true };
  } catch (error) {
    console.error('❌ Error al enviar el correo:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

module.exports = {
  sendEmail
}; 