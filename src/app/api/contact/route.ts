import { NextResponse } from "next/server";
import { getDbConnection, sql } from "@/lib/db";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { 
      name, email, company, service, message, 
      employee_count, division_status, company_count 
    } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ message: "Required fields are missing" }, { status: 400 });
    }

    const pool = await getDbConnection();
    
    // Save to database
    await pool.request()
      .input('name', sql.NVarChar, name)
      .input('email', sql.NVarChar, email)
      .input('company', sql.NVarChar, company || '')
      .input('service', sql.NVarChar, service || 'General')
      .input('message', sql.NVarChar, message)
      .input('employee_count', sql.NVarChar, employee_count || null)
      .input('division_status', sql.NVarChar, division_status || null)
      .input('company_count', sql.NVarChar, company_count || null)
      .query(`
        INSERT INTO inquiries 
        (name, email, company, service, message, employee_count, division_status, company_count) 
        VALUES 
        (@name, @email, @company, @service, @message, @employee_count, @division_status, @company_count)
      `);

    // --- Send Email Notification ---
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"FIDA Global Site" <${process.env.EMAIL_USER}>`,
      to: "info@fidaglobal.com",
      replyTo: email,
      subject: `New Lead: ${service} from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">New Website Inquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Company:</strong> ${company || 'N/A'}</p>
          <p><strong>Interest:</strong> ${service}</p>
          
          ${service === 'Smart HRIS' ? `
            <div style="background: #f0f7ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #1e40af;">Product Specific Details:</h4>
              <p><strong>Employees:</strong> ${employee_count}</p>
              <p><strong>Multi-Company:</strong> ${company_count}</p>
              <p><strong>Hierarchy/Designations:</strong> ${division_status}</p>
            </div>
          ` : ''}

          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; background: #f9fafb; padding: 15px; border-radius: 8px;">${message}</p>
          </div>
          
          <p style="font-size: 11px; color: #9ca3af; margin-top: 30px; text-align: center;">
            This message was sent from the FIDA Global website contact form.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Success! Your message has been recorded and our team will get back to you shortly." });
  } catch (error: any) {
    console.error("Contact Form Database Error:", error);
    return NextResponse.json({ 
      message: "An internal error occurred. Please try again later.", 
      error: error.message 
    }, { status: 500 });
  }
}
