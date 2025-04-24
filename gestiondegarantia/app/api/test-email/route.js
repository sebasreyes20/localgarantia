import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function GET(request) {
  try {
    // Create a transport with environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number.parseInt(process.env.EMAIL_PORT || "587"),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    // Get test recipients
    const adminEmails = process.env.ADMIN_EMAILS?.split(",") || []

    if (adminEmails.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No email addresses configured in ADMIN_EMAILS",
        },
        { status: 400 },
      )
    }

    // Send a test email
    const info = await transporter.sendMail({
      from: `"Warranty System" <${process.env.EMAIL_FROM}>`,
      to: adminEmails.join(","),
      subject: "Email configuration test",
      html: `
        <h1>Email Configuration Test</h1>
        <p>This is a test email to verify that the email configuration is working correctly.</p>
        <p>Configured environment variables:</p>
        <ul>
          <li><strong>EMAIL_HOST:</strong> ${process.env.EMAIL_HOST}</li>
          <li><strong>EMAIL_PORT:</strong> ${process.env.EMAIL_PORT}</li>
          <li><strong>EMAIL_SECURE:</strong> ${process.env.EMAIL_SECURE}</li>
          <li><strong>EMAIL_USER:</strong> ${process.env.EMAIL_USER}</li>
          <li><strong>EMAIL_FROM:</strong> ${process.env.EMAIL_FROM}</li>
          <li><strong>ADMIN_EMAILS:</strong> ${process.env.ADMIN_EMAILS}</li>
          <li><strong>NEXT_PUBLIC_APP_URL:</strong> ${process.env.NEXT_PUBLIC_APP_URL}</li>
        </ul>
        <p>Date and time: ${new Date().toLocaleString()}</p>
      `,
    })

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully",
      messageId: info.messageId,
      previewURL: nodemailer.getTestMessageUrl?.(info) || null,
    })
  } catch (error) {
    console.error("Error sending test email:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Error sending test email",
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
