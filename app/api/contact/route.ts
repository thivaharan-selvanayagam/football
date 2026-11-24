import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, order, message } = await req.json();

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpUser || !smtpPass) {
      return NextResponse.json(
        { success: false, error: "SMTP credentials not configured on the server." },
        { status: 500 }
      );
    }

    const port = Number(process.env.SMTP_PORT) || 587;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port,
      secure: port === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const primaryStoreEmail =
      process.env.ORDER_EMAIL?.trim() ||
      process.env.actual_email?.trim() ||
      "hisassports@gmail.com";

    const recipients = Array.from(
      new Set([primaryStoreEmail, "thivaharan@vto.group"].filter(Boolean))
    );

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111; background: #f8fafc; padding: 20px; border-radius: 12px;">
        <h2 style="background: #232323; color: #fff; padding: 14px 18px; border-radius: 8px; margin-top: 0;">
          📩 New Support Message — SAS Sports
        </h2>
        <div style="background: #fff; padding: 18px; border-radius: 8px; border: 1px solid #e2e8f0;">
          <p style="margin: 6px 0;"><strong>Name:</strong> ${name}</p>
          <p style="margin: 6px 0;"><strong>Email:</strong> ${email}</p>
          ${order ? `<p style="margin: 6px 0;"><strong>Order Number:</strong> ${order}</p>` : ""}
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 14px 0;" />
          <p style="margin: 6px 0; white-space: pre-wrap; line-height: 1.6;">${message}</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"SAS Sports Support" <${smtpUser}>`,
      to: recipients.join(", "),
      replyTo: email.trim(),
      subject: `Support Inquiry from ${name}${order ? ` (Order ${order})` : ""}`,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Support contact email error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to send message." },
      { status: 500 }
    );
  }
}
