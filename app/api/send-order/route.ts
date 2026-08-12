import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customerDetails, // { name, email, address, phone }
      cartItems,       // List of custom cards in order
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

    const attachments: any[] = [];
    let itemsHtml = "";

    cartItems.forEach((item: any, index: number) => {
      const origCid = `origPhoto_${index}`;
      const cardCid = `cardPreview_${index}`;

      // 1. Original Non-Background Removed Photo
      if (item.rawOriginalPhoto) {
        if (item.rawOriginalPhoto.startsWith("data:")) {
          const matches = item.rawOriginalPhoto.match(/^data:(.+);base64,(.+)$/);
          if (matches) {
            attachments.push({
              filename: `original-photo-${index + 1}.png`,
              content: Buffer.from(matches[2], "base64"),
              contentType: matches[1],
              cid: origCid,
            });
          }
        }
      }

      // 2. Full Rendered Card Preview (Matching Screenshot)
      if (item.fullCardPreview) {
        if (item.fullCardPreview.startsWith("data:")) {
          const matches = item.fullCardPreview.match(/^data:(.+);base64,(.+)$/);
          if (matches) {
            attachments.push({
              filename: `full-card-preview-${index + 1}.png`,
              content: Buffer.from(matches[2], "base64"),
              contentType: matches[1],
              cid: cardCid,
            });
          }
        }
      }

      itemsHtml += `
        <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px; background: #fff;">
          <h3 style="margin-top: 0; color: #1e293b;">Item #${index + 1}: ${item.productName}</h3>
          <p><strong>Player Name:</strong> ${item.name}</p>
          <p><strong>Position & Rating:</strong> ${item.position} (${item.overall})</p>
          <p><strong>Style / Size:</strong> ${item.style} / ${item.size}</p>
          <p><strong>Club / Country:</strong> ${item.club} / ${item.country}</p>
          <p><strong>Stats:</strong> PAC: ${item.attributes?.PAC} | SHO: ${item.attributes?.SHO} | PAS: ${item.attributes?.PAS} | DRI: ${item.attributes?.DRI} | DEF: ${item.attributes?.DEF} | PHY: ${item.attributes?.PHY}</p>
          
          <table style="width: 100%; margin-top: 15px;">
            <tr>
              <td style="vertical-align: top; padding-right: 10px; width: 50%;">
                <p style="margin-bottom: 6px;"><strong>1. Original Uploaded Photo:</strong></p>
                <img src="cid:${origCid}" style="width: 100%; max-width: 220px; border-radius: 8px; border: 1px solid #ccc; display: block;" />
              </td>
              <td style="vertical-align: top; width: 50%;">
                <p style="margin-bottom: 6px;"><strong>2. Full Card Preview:</strong></p>
                <img src="cid:${cardCid}" style="width: 100%; max-width: 220px; border-radius: 8px; border: 1px solid #ccc; display: block;" />
              </td>
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

        <!-- CUSTOMER CHECKOUT DETAILS SECTION -->
        <div style="background: #fff; padding: 18px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 20px;">
          <h3 style="margin-top: 0; color: #0f172a; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">📋 Customer Checkout Details</h3>
          <p style="margin: 6px 0;"><strong>Customer Name:</strong> ${customerDetails?.name || "N/A"}</p>
          <p style="margin: 6px 0;"><strong>Email Address:</strong> ${customerDetails?.email || "N/A"}</p>
          <p style="margin: 6px 0;"><strong>Phone Number:</strong> ${customerDetails?.phone || "N/A"}</p>
          <p style="margin: 6px 0;"><strong>Shipping Address:</strong> ${customerDetails?.address || "N/A"}</p>
        </div>

        <h3 style="color: #0f172a;">🎴 Order Items</h3>
        ${itemsHtml}
      </div>
    `;

    await transporter.sendMail({
      from: `"SAS Sports Orders" <${process.env.SMTP_USER}>`,
      to: "thivaharan@vto.group",
      subject: `New Order from ${customerDetails?.name || "Customer"} (${cartItems?.length || 1} Item)`,
      html: htmlContent,
      attachments,
    });

    return NextResponse.json({ success: true, message: "Order email sent successfully!" });
  } catch (error: any) {
    console.error("Failed to send order email:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}