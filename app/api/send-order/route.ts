import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpUser || !smtpPass) {
      console.error("CRITICAL ERROR: SMTP_USER or SMTP_PASS environment variables are missing.");
      return NextResponse.json(
        { success: false, error: "SMTP credentials not configured on the server." },
        { status: 500 }
      );
    }

    const customerDetails = body.customerDetails || {
      name: body.customerName || body.name || "Customer",
      email: body.customerEmail || body.email || "N/A",
      phone: body.customerPhone || body.phone || "N/A",
      address: body.customerAddress || body.address || "N/A",
    };

    const cartItems = Array.isArray(body.cartItems) && body.cartItems.length > 0
      ? body.cartItems
      : [body];

    // Transporter configured with Port 587 TLS for maximum cloud hosting compatibility
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // port 587 requires secure: false
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const attachments: any[] = [];
    let itemsHtml = "";

    cartItems.forEach((item: any, index: number) => {
      const origCid = `origPhoto_${index}`;
      const cardCid = `cardPreview_${index}`;

      let hasOriginal = false;
      let hasPreview = false;

      // 1. Raw Original Photo
      const rawOriginal = item.rawOriginalPhoto || item.rawUpload;
      if (rawOriginal && typeof rawOriginal === "string" && rawOriginal.startsWith("data:")) {
        const matches = rawOriginal.match(/^data:(.+);base64,(.+)$/);
        if (matches) {
          attachments.push({
            filename: `original-photo-${index + 1}.jpeg`,
            content: Buffer.from(matches[2], "base64"),
            contentType: matches[1],
            cid: origCid,
          });
          hasOriginal = true;
        }
      }

      // 2. Full Rendered Card Preview (with fallbacks)
      const previewImg = item.fullCardPreview || item.photo;
      if (previewImg && typeof previewImg === "string" && previewImg.startsWith("data:")) {
        const matches = previewImg.match(/^data:(.+);base64,(.+)$/);
        if (matches) {
          attachments.push({
            filename: `full-card-preview-${index + 1}.png`,
            content: Buffer.from(matches[2], "base64"),
            contentType: matches[1],
            cid: cardCid,
          });
          hasPreview = true;
        }
      }

      const attrs = item.attributes || item.attrs || {};

      itemsHtml += `
        <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px; background: #fff;">
          <h3 style="margin-top: 0; color: #1e293b;">Item #${index + 1}: ${item.productName || item.productSlug || "Custom Card"}</h3>
          <p><strong>Player Name:</strong> ${item.name || "N/A"}</p>
          <p><strong>Position & Rating:</strong> ${item.position || "N/A"} (${item.overall || "N/A"})</p>
          <p><strong>Style / Size:</strong> ${item.style || "Standard"} / ${item.size || "Medium"}</p>
          <p><strong>Club / Country:</strong> ${item.club || "N/A"} / ${item.country || "N/A"}</p>
          <p><strong>Font Color:</strong> <span style="display:inline-block; width:12px; height:12px; background:${item.textColor || "#3c3f25"}; border-radius:50%; margin-right:4px;"></span>${item.textColor || "#3c3f25"}</p>
          <p><strong>Stats:</strong> PAC: ${attrs.PAC ?? "N/A"} | SHO: ${attrs.SHO ?? "N/A"} | PAS: ${attrs.PAS ?? "N/A"} | DRI: ${attrs.DRI ?? "N/A"} | DEF: ${attrs.DEF ?? "N/A"} | PHY: ${attrs.PHY ?? "N/A"}</p>
          
          <table style="width: 100%; margin-top: 15px;">
            <tr>
              ${
                hasOriginal
                  ? `<td style="vertical-align: top; padding-right: 10px; width: 50%;">
                      <p style="margin-bottom: 6px;"><strong>1. Original Uploaded Photo:</strong></p>
                      <img src="cid:${origCid}" style="width: 100%; max-width: 220px; border-radius: 8px; border: 1px solid #ccc; display: block;" />
                     </td>`
                  : ""
              }
              ${
                hasPreview
                  ? `<td style="vertical-align: top; width: 50%;">
                      <p style="margin-bottom: 6px;"><strong>2. Full Card Preview:</strong></p>
                      <img src="cid:${cardCid}" style="width: 100%; max-width: 220px; border-radius: 8px; border: 1px solid #ccc; display: block;" />
                     </td>`
                  : ""
              }
            </tr>
          </table>
        </div>
      `;
    });

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; color: #111; background: #f8fafc; padding: 20px; border-radius: 12px;">
        <h2 style="background: #2a2a2a; color: #fff; padding: 16px; text-align: center; border-radius: 8px; margin-top: 0;">
          🚀 New Custom Card Order Received!
        </h2>

        <div style="background: #fff; padding: 18px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 20px;">
          <h3 style="margin-top: 0; color: #0f172a; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">📋 Customer Checkout Details</h3>
          <p style="margin: 6px 0;"><strong>Customer Name:</strong> ${customerDetails.name}</p>
          <p style="margin: 6px 0;"><strong>Email Address:</strong> ${customerDetails.email}</p>
          <p style="margin: 6px 0;"><strong>Phone Number:</strong> ${customerDetails.phone}</p>
          <p style="margin: 6px 0;"><strong>Shipping Address:</strong> ${customerDetails.address}</p>
        </div>

        <h3 style="color: #0f172a;">🎴 Order Items</h3>
        ${itemsHtml}
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"SAS Sports Orders" <${smtpUser}>`,
      to: "thivaharan@vto.group",
      subject: `New Order from ${customerDetails.name} (${cartItems.length} Item)`,
      html: htmlContent,
      attachments,
    });

    console.log("Email dispatched. ID:", info.messageId);
    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error: any) {
    console.error("API send-order error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}