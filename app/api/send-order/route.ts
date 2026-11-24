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

    const cartItems =
      Array.isArray(body.cartItems) && body.cartItems.length > 0 ? body.cartItems : [body];

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

    const attachments: any[] = [];
    let itemsHtml = "";
    let customerItemsSummaryHtml = "";

    cartItems.forEach((item: any, index: number) => {
      const qty = item.qty || 1;
      const title = item.productName || item.productSlug || "Order Item";

      customerItemsSummaryHtml += `
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #1e293b;">
            <strong>${title}</strong>${item.size && item.size !== "Test" ? ` (${item.size})` : ""}${item.name && item.itemType !== "apparel" && item.itemType !== "test" ? ` — ${item.name}` : ""}
          </td>
          <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #475569; text-align: right;">
            × ${qty}
          </td>
        </tr>
      `;

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

      if (item.itemType === "test" || item.productSlug === "stripe-test-item") {
        itemsHtml += `
          <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px; background: #fff;">
            <h3 style="margin-top: 0; color: #1e293b;">Item #${index + 1}: ${item.productName || "Stripe Test Item"} (Qty: ${qty})</h3>
            <p><strong>Category:</strong> Private Stripe Checkout Verification</p>
            <p><strong>Unit Price:</strong> $${Number(item.unitPrice ?? 0.5).toFixed(2)} CAD</p>
          </div>
        `;
        return;
      }

      if (item.itemType === "stripe-fallback") {
        itemsHtml += `
          <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px; background: #fff;">
            <h3 style="margin-top: 0; color: #1e293b;">Item #${index + 1}: ${title} (Qty: ${qty})</h3>
            ${item.description ? `<p><strong>Details:</strong> ${item.description}</p>` : ""}
          </div>
        `;
        return;
      }

      const isApparel =
        item.itemType === "apparel" ||
        (typeof item.productSlug === "string" && item.productSlug.startsWith("shiva-"));

      if (isApparel) {
        itemsHtml += `
          <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px; background: #fff;">
            <h3 style="margin-top: 0; color: #1e293b;">Item #${index + 1}: ${item.productName || "Fundraiser Apparel"} (Qty: ${qty})</h3>
            <p><strong>Category:</strong> Shiva Italy 2027 Fundraiser Clothing</p>
            <p><strong>Selected Size:</strong> ${item.size || "M"}</p>
            <p><strong>Unit Price:</strong> $${item.unitPrice ?? "N/A"}.00 CAD</p>
          </div>
        `;
        return;
      }

      const attrs = item.attributes || item.attrs || {};
      const addonList =
        Array.isArray(item.addons) && item.addons.length > 0 ? item.addons.join(", ") : "None";

      itemsHtml += `
        <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px; background: #fff;">
          <h3 style="margin-top: 0; color: #1e293b;">Item #${index + 1}: ${title} (Qty: ${qty})</h3>
          <p><strong>Player Name:</strong> ${item.name || "N/A"}</p>
          <p><strong>Position &amp; Rating:</strong> ${item.position || "N/A"} (${item.overall || "N/A"})</p>
          <p><strong>Style / Size:</strong> ${item.style || "Standard"} / ${item.size || "Large"}</p>
          <p><strong>Club / Country:</strong> ${item.club || "N/A"} / ${item.country || "N/A"}</p>
          <p><strong>Add-ons:</strong> ${addonList}</p>
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

    const orderRef = body.orderRef || "N/A";
    const stripeSessionId = body.stripeSessionId || null;
    const promoCode = body.promoCode || customerDetails.promoCode || null;
    const shippingMethodLabel = body.shippingMethod || customerDetails.shippingMethod || null;
    const totalPaid =
      typeof body.totalPaid === "number"
        ? `$${body.totalPaid.toFixed(2)} ${body.currency || "CAD"}`
        : null;

    const adminHtmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; color: #111; background: #f8fafc; padding: 20px; border-radius: 12px;">
        <h2 style="background: #2a2a2a; color: #fff; padding: 16px; text-align: center; border-radius: 8px; margin-top: 0;">
          🚀 New Paid Order Received (${orderRef})
        </h2>

        <div style="background: #fff; padding: 18px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 20px;">
          <h3 style="margin-top: 0; color: #0f172a; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">💳 Payment &amp; Customer Details</h3>
          <p style="margin: 6px 0;"><strong>Order Reference:</strong> ${orderRef}</p>
          ${totalPaid ? `<p style="margin: 6px 0;"><strong>Total Paid (Stripe):</strong> ${totalPaid}</p>` : ""}
          ${shippingMethodLabel ? `<p style="margin: 6px 0;"><strong>Shipping Method:</strong> ${shippingMethodLabel}</p>` : ""}
          ${promoCode ? `<p style="margin: 6px 0;"><strong>Promo Code Used:</strong> ${promoCode}</p>` : ""}
          ${stripeSessionId ? `<p style="margin: 6px 0;"><strong>Stripe Session ID:</strong> ${stripeSessionId}</p>` : ""}
          <p style="margin: 6px 0;"><strong>Customer Name:</strong> ${customerDetails.name}</p>
          <p style="margin: 6px 0;"><strong>Email Address:</strong> ${customerDetails.email}</p>
          <p style="margin: 6px 0;"><strong>Phone Number:</strong> ${customerDetails.phone}</p>
          <p style="margin: 6px 0;"><strong>Shipping Address:</strong> ${customerDetails.address}</p>
          <p style="margin: 6px 0;"><strong>Promotional &amp; Social Media Consent:</strong> ${customerDetails.mediaConsent ? "Yes (Accepted)" : "N/A"}</p>
        </div>

        <h3 style="color: #0f172a;">🎴 Order Items</h3>
        ${itemsHtml}
      </div>
    `;

    const primaryStoreEmail =
      process.env.ORDER_EMAIL?.trim() ||
      process.env.actual_email?.trim() ||
      "hisassports@gmail.com";

    const adminRecipients = Array.from(
      new Set([primaryStoreEmail, "thivaharan@vto.group"].filter(Boolean))
    );

    const validCustomerEmail =
      typeof customerDetails.email === "string" && customerDetails.email.includes("@")
        ? customerDetails.email.trim()
        : undefined;

    // 1. Send Admin Fulfillment Email to SAS Sports
    const info = await transporter.sendMail({
      from: `"SAS Sports Orders" <${smtpUser}>`,
      to: adminRecipients.join(", "),
      replyTo: validCustomerEmail,
      subject: `Paid Order ${orderRef} from ${customerDetails.name} (${cartItems.length} Item${cartItems.length === 1 ? "" : "s"})`,
      html: adminHtmlContent,
      attachments,
    });

    // 2. Send Order Confirmation Receipt Email to the Customer
    if (validCustomerEmail) {
      try {
        const customerHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111; background: #f8fafc; padding: 24px; border-radius: 12px;">
            <h2 style="background: #232323; color: #fff; padding: 16px; text-align: center; border-radius: 8px; margin-top: 0;">
              Order Confirmed — SAS Sports
            </h2>
            <div style="background: #fff; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
              <p style="margin-top: 0;">Hi <strong>${customerDetails.name}</strong>,</p>
              <p style="color: #475569; line-height: 1.6;">
                Thank you for your order! Your payment has been confirmed and our team is preparing your order.
              </p>
              <div style="background: #f8fafc; border-radius: 8px; padding: 14px; margin: 16px 0; font-size: 14px;">
                <p style="margin: 4px 0;"><strong>Order Reference:</strong> ${orderRef}</p>
                ${totalPaid ? `<p style="margin: 4px 0;"><strong>Total Paid:</strong> ${totalPaid}</p>` : ""}
                ${shippingMethodLabel ? `<p style="margin: 4px 0;"><strong>Shipping:</strong> ${shippingMethodLabel}</p>` : ""}
                <p style="margin: 4px 0;"><strong>Shipping Address:</strong> ${customerDetails.address}</p>
              </div>
              <table style="width: 100%; border-collapse: collapse; margin-top: 12px;">
                ${customerItemsSummaryHtml}
              </table>
              <p style="font-size: 13px; color: #64748b; margin-top: 20px; margin-bottom: 0;">
                Questions? Reply directly to this email or contact us at <a href="mailto:hisassports@gmail.com" style="color: #111;">hisassports@gmail.com</a>.
              </p>
            </div>
          </div>
        `;

        await transporter.sendMail({
          from: `"SAS Sports" <${smtpUser}>`,
          to: validCustomerEmail,
          replyTo: primaryStoreEmail,
          subject: `Your SAS Sports Order Confirmation (${orderRef})`,
          html: customerHtml,
        });
      } catch (custErr) {
        console.error("Customer confirmation email warning:", custErr);
      }
    }

    console.log("Email dispatched. ID:", info.messageId);
    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error: any) {
    console.error("API send-order error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
