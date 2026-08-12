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
      rawUpload, // Original client uploaded photo (base64 or URL)
      photo,     // Cropped card preview photo (base64 or URL)
    } = body;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const totalAmount = unitPrice + addonsPrice;

    // Prepare attachments array for native email display
    const attachments: any[] = [];

    // Process Original Uploaded Photo
    if (rawUpload) {
      if (rawUpload.startsWith("data:")) {
        const matches = rawUpload.match(/^data:(.+);base64,(.+)$/);
        if (matches) {
          attachments.push({
            filename: "original-photo.png",
            content: Buffer.from(matches[2], "base64"),
            contentType: matches[1],
            cid: "originalPhotoImg", // Referenced in HTML via cid:originalPhotoImg
          });
        }
      } else {
        attachments.push({
          filename: "original-photo.png",
          path: rawUpload,
          cid: "originalPhotoImg",
        });
      }
    }

    // Process Cropped Preview Photo
    if (photo) {
      if (photo.startsWith("data:")) {
        const matches = photo.match(/^data:(.+);base64,(.+)$/);
        if (matches) {
          attachments.push({
            filename: "cropped-preview.png",
            content: Buffer.from(matches[2], "base64"),
            contentType: matches[1],
            cid: "croppedPreviewImg", // Referenced in HTML via cid:croppedPreviewImg
          });
        }
      } else {
        attachments.push({
          filename: "cropped-preview.png",
          path: photo,
          cid: "croppedPreviewImg",
        });
      }
    }

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
        <table style="width: 100%; margin-top: 15px;">
          <tr>
            ${
              rawUpload
                ? `<td style="vertical-align: top; padding-right: 15px; width: 50%;">
                    <p style="margin-bottom: 8px;"><strong>1. Original Uploaded Photo:</strong></p>
                    <img src="cid:originalPhotoImg" style="width: 100%; max-width: 250px; border-radius: 8px; border: 1px solid #ccc; display: block;" />
                   </td>`
                : ""
            }
            ${
              photo
                ? `<td style="vertical-align: top; width: 50%;">
                    <p style="margin-bottom: 8px;"><strong>2. Cropped Card Preview:</strong></p>
                    <img src="cid:croppedPreviewImg" style="width: 100%; max-width: 250px; border-radius: 8px; border: 1px solid #ccc; display: block;" />
                   </td>`
                : ""
            }
          </tr>
        </table>

        <h3 style="margin-top: 25px; padding-top: 15px; border-t: 1px solid #eee;">Total Price: LKR ${totalAmount}</h3>
      </div>
    `;

    await transporter.sendMail({
      from: `"SAS Sports Orders" <${process.env.SMTP_USER}>`,
      to: "thivaharan@vto.group",
      subject: `New Custom Card Order: ${name || "Player"} (${productName})`,
      html: htmlContent,
      attachments, // Attachments render directly inside the email body and as email downloads
    });

    return NextResponse.json({ success: true, message: "Order email sent successfully!" });
  } catch (error: any) {
    console.error("Failed to send order email:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}