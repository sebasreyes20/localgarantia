const { sendEmail } = require('../lib/sendgrid');

// Ejemplo de uso
async function enviarCorreoDePrueba() {
  try {
    const resultado = await sendEmail({
      to: 'sebastian.pinzon.3954@gmail.com', // Cambia esto por tu dirección de correo
      from: 'sebastian.pinzon.3954@gmail.com', // Debe ser la dirección que verificaste en SendGrid
      subject: 'Correo de prueba desde SendGrid',
      text: 'Este es un correo de prueba enviado desde Node.js usando SendGrid',
      html: '<strong>Este es un correo de prueba enviado desde Node.js usando SendGrid</strong>'
    });

    if (resultado.success) {
      console.log('Correo enviado correctamente');
    } else {
      console.error('Error al enviar el correo:', resultado.error);
    }
  } catch (error) {
    console.error('Error inesperado:', error);
  }
}

// Solo ejecutar si este archivo se ejecuta directamente
if (require.main === module) {
  enviarCorreoDePrueba();
} 