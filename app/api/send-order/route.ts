import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      productName,
      name,
      position,
      overall,
      style,
      size,
      club,
      country,
      attributes,
      textColor,
      unitPrice,
      addonsPrice,
      rawUpload, // Original client uploaded photo
      photo,     // Cropped/processed preview photo
    } = body;

    // Configure Nodemailer transporter (e.g. Gmail SMTP, SendGrid, or custom SMTP)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, // App-specific password
      },
    });

    const totalAmount = unitPrice + addonsPrice;

    // Build Email HTML Layout
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
        <h2 style="background: #2a2a2a; color: #fff; padding: 15px; text-align: center; border-radius: 8px;">
          🚀 New Custom Card Order Received!
        </h2>

        <h3>Card Customisation Details:</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Product:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${productName}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Player Name:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${name}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Position:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${position}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Overall Rating:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${overall}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Font Color:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;"><span style="display:inline-block; width:12px; height:12px; background:${textColor}; border-radius:50%; margin-right:5px;"></span>${textColor}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Style & Size:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${style} / ${size}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Club:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${club}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Country:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${country}</td></tr>
        </table>

        <h3>Player Attributes:</h3>
        <p style="background: #f9f9f9; padding: 12px; border-radius: 6px; font-family: monospace;">
          PAC: ${attributes.PAC} | SHO: ${attributes.SHO} | PAS: ${attributes.PAS} | DRI: ${attributes.DRI} | DEF: ${attributes.DEF} | PHY: ${attributes.PHY}
        </p>

        <h3>Uploaded Assets:</h3>
        <div style="display: flex; gap: 20px; margin-top: 15px;">
          ${
            rawUpload
              ? `<div>
                  <p><strong>1. Original Uploaded Photo:</strong></p>
                  <img src="${rawUpload}" style="max-width: 250px; border-radius: 8px; border: 1px solid #ccc;" />
                </div>`
              : ""
          }
          ${
            photo
              ? `<div style="margin-top: 15px;">
                  <p><strong>2. Cropped Card Preview:</strong></p>
                  <img src="${photo}" style="max-width: 250px; border-radius: 8px; border: 1px solid #ccc;" />
                </div>`
              : ""
          }
        </div>

        <h3 style="margin-top: 25px;">Total Price: LKR ${totalAmount}</h3>
      </div>
    `;

    // Send Mail to Destination Address
    await transporter.sendMail({
      from: `"SAS Sports Orders" <${process.env.SMTP_USER}>`,
      to: "thivaharan@vto.group",
      subject: `New Custom Card Order: ${name || "Player"} (${productName})`,
      html: htmlContent,
    });

    return NextResponse.json({ success: true, message: "Order email sent successfully!" });
  } catch (error: any) {
    console.error("Failed to send order email:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}