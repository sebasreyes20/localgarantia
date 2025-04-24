import nodemailer from "nodemailer"
const { sendEmail } = require('./sendgrid');

// Configure email transport
// In production, you would use a service like SendGrid, Mailgun, etc.
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.example.com",
  port: Number.parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER || "user@example.com",
    pass: process.env.EMAIL_PASSWORD || "password",
  },
})

// Admin emails configuration
const ADMIN_EMAILS = ['sebastian.pinzon.3954@gmail.com']; // Add admin emails here

/**
 * Sends a notification to admins when a new warranty is created
 */
async function notifyAdminsNewWarranty(warranty) {
  const subject = `New Warranty Created - ${warranty.customerName}`;
  const text = `
    A new warranty has been created:
    
    Customer: ${warranty.customerName}
    Phone: ${warranty.customerPhone}
    Product: ${warranty.brand} ${warranty.model}
    Serial: ${warranty.serial}
    Damage Description: ${warranty.damageDescription}
    
    Please assign this warranty to a seller.
    
    Link to manage warranty: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard/warranties/${warranty.id}
  `;

  try {
    await Promise.all(
      ADMIN_EMAILS.map(adminEmail =>
        sendEmail({
          to: adminEmail,
          from: 'sebastian.pinzon.3954@gmail.com',
          subject,
          text,
          html: text.replace(/\n/g, '<br>')
        })
      )
    );
    console.log('✅ Notification sent to admins');
  } catch (error) {
    console.error('❌ Error sending notification to admins:', error);
  }
}

/**
 * Sends a notification to the seller when a warranty is assigned to them
 */
async function notifySellerAssignedWarranty(warranty, seller) {
  const subject = `New Warranty Assigned - ${warranty.customerName}`;
  const text = `
    A new warranty has been assigned to you:
    
    Customer: ${warranty.customerName}
    Phone: ${warranty.customerPhone}
    Product: ${warranty.brand} ${warranty.model}
    Serial: ${warranty.serial}
    Damage Description: ${warranty.damageDescription}
    
    Please manage this warranty as soon as possible.
    
    Link to manage warranty: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard/warranties/${warranty.id}
  `;

  try {
    await sendEmail({
      to: seller.email,
      from: 'sebastian.pinzon.3954@gmail.com',
      subject,
      text,
      html: text.replace(/\n/g, '<br>')
    });
    console.log('✅ Notification sent to seller');
  } catch (error) {
    console.error('❌ Error sending notification to seller:', error);
  }
}

/**
 * Sends a reminder to the seller about a pending warranty
 */
async function sendWarrantyReminder(warranty, seller) {
  const subject = `Reminder: Pending Warranty - ${warranty.customerName}`;
  const text = `
    You have a pending warranty that requires your attention:
    
    Customer: ${warranty.customerName}
    Phone: ${warranty.customerPhone}
    Product: ${warranty.brand} ${warranty.model}
    Serial: ${warranty.serial}
    Assignment Date: ${new Date(warranty.assignedAt).toLocaleDateString()}
    
    Please manage this warranty as soon as possible.
    
    Link to manage warranty: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard/warranties/${warranty.id}
  `;

  try {
    await sendEmail({
      to: seller.email,
      from: 'sebastian.pinzon.3954@gmail.com',
      subject,
      text,
      html: text.replace(/\n/g, '<br>')
    });
    console.log('✅ Reminder sent to seller');
  } catch (error) {
    console.error('❌ Error sending reminder to seller:', error);
  }
}

module.exports = {
  notifyAdminsNewWarranty,
  notifySellerAssignedWarranty,
  sendWarrantyReminder
};
