import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { ADDONS, SIZES } from "@/lib/data";

export const maxDuration = 60;

function parseDataUrl(dataUrl?: string | null): { mime: string; buffer: Buffer; ext: string } | null {
  if (!dataUrl || typeof dataUrl !== "string" || !dataUrl.startsWith("data:")) return null;
  const matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!matches) return null;
  const mime = matches[1];
  const ext = mime.includes("png") ? "png" : mime.includes("webp") ? "webp" : "jpg";
  return {
    mime,
    buffer: Buffer.from(matches[2], "base64"),
    ext,
  };
}

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
      const itemNum = index + 1;
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

      if (item.itemType === "test" || item.productSlug === "stripe-test-item") {
        itemsHtml += `
          <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px; background: #fff;">
            <h3 style="margin-top: 0; color: #1e293b;">Item #${itemNum}: ${item.productName || "Stripe Test Item"} (Qty: ${qty})</h3>
            <p><strong>Category:</strong> Private Stripe Checkout Verification</p>
            <p><strong>Unit Price:</strong> $${Number(item.unitPrice ?? 0.5).toFixed(2)} CAD</p>
          </div>
        `;
        return;
      }

      if (item.itemType === "stripe-fallback") {
        itemsHtml += `
          <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px; background: #fff;">
            <h3 style="margin-top: 0; color: #1e293b;">Item #${itemNum}: ${title} (Qty: ${qty})</h3>
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
            <h3 style="margin-top: 0; color: #1e293b;">Item #${itemNum}: ${item.productName || "Fundraiser Apparel"} (Qty: ${qty})</h3>
            <p><strong>Category:</strong> Shiva Italy 2027 Fundraiser Clothing</p>
            <p><strong>Selected Size:</strong> ${item.size || "M"}</p>
            <p><strong>Unit Price:</strong> $${item.unitPrice ?? "N/A"}.00 CAD</p>
          </div>
        `;
        return;
      }

      // --- CUSTOM CARD ATTACHMENTS ---
      const origCid = `origPhoto_${index}`;
      const cutoutCid = `bgRemovedCutout_${index}`;
      const cardCid = `cardPreview_${index}`;
      const badgeCid = `customBadge_${index}`;
      const flagCid = `customFlag_${index}`;

      // 1. Original Uploaded Photo (Background NOT Removed)
      const parsedOrig = parseDataUrl(item.rawOriginalPhoto || item.rawUpload);
      if (parsedOrig) {
        attachments.push({
          filename: `item-${itemNum}-original-unremoved-bg.${parsedOrig.ext}`,
          content: parsedOrig.buffer,
          contentType: parsedOrig.mime,
          cid: origCid,
        });
      }

      // 2. Cropped Background-Removed Player Cutout Photo
      const parsedCutout =
        item.photo && item.photo !== item.rawOriginalPhoto ? parseDataUrl(item.photo) : null;
      if (parsedCutout) {
        attachments.push({
          filename: `item-${itemNum}-bg-removed-cutout.${parsedCutout.ext}`,
          content: parsedCutout.buffer,
          contentType: parsedCutout.mime,
          cid: cutoutCid,
        });
      }

      // 3. Full Rendered Card Preview (with BG-removed photo, frame, stats, flag & badge)
      const parsedPreview = parseDataUrl(item.fullCardPreview || item.photo);
      if (parsedPreview) {
        attachments.push({
          filename: `item-${itemNum}-full-card-preview.${parsedPreview.ext}`,
          content: parsedPreview.buffer,
          contentType: parsedPreview.mime,
          cid: cardCid,
        });
      }

      // 4. Custom Uploaded Club Badge (if customer uploaded a custom file)
      const parsedCustomBadge = parseDataUrl(item.clubBadge);
      if (parsedCustomBadge) {
        attachments.push({
          filename: `item-${itemNum}-custom-club-badge.${parsedCustomBadge.ext}`,
          content: parsedCustomBadge.buffer,
          contentType: parsedCustomBadge.mime,
          cid: badgeCid,
        });
      }

      // 5. Custom Uploaded Country Flag (if customer uploaded a custom file)
      const parsedCustomFlag = parseDataUrl(item.countryFlag);
      if (parsedCustomFlag) {
        attachments.push({
          filename: `item-${itemNum}-custom-country-flag.${parsedCustomFlag.ext}`,
          content: parsedCustomFlag.buffer,
          contentType: parsedCustomFlag.mime,
          cid: flagCid,
        });
      }

      const attrs = item.attributes || item.attrs || {};
      const sizeDim =
        item.sizeDim || SIZES.find((s) => s.id === item.size)?.dim || "";
      const addonNames = Array.isArray(item.addons) && item.addons.length > 0
        ? item.addons
            .map((id: string) => ADDONS.find((a) => a.id === id)?.name || id)
            .join(", ")
        : "None";

      const clubBadgeNote = parsedCustomBadge
        ? "Custom Uploaded Logo (attached)"
        : item.clubBadge || "Default / Preset";
      const countryFlagNote = parsedCustomFlag
        ? "Custom Uploaded Flag (attached)"
        : item.countryFlag || "Default / Preset";

      itemsHtml += `
        <div style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px; margin-bottom: 22px; background: #fff;">
          <h3 style="margin-top: 0; color: #0f172a; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px;">
            Item #${itemNum}: ${title} (Qty: ${qty})
          </h3>
          <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
            <tr>
              <td style="padding: 4px 0;"><strong>Card Design Slug:</strong> ${item.productSlug || "N/A"}</td>
              <td style="padding: 4px 0;"><strong>Style &amp; Size:</strong> ${item.style || "Standard"} / ${item.size || "Large"} ${sizeDim}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0;"><strong>Player Name:</strong> ${item.name || "N/A"}</td>
              <td style="padding: 4px 0;"><strong>Position &amp; Overall:</strong> ${item.position || "N/A"} (${item.overall ?? "N/A"} OVR)</td>
            </tr>
            <tr>
              <td style="padding: 4px 0;"><strong>Club Name:</strong> ${item.club || "UMSC"}</td>
              <td style="padding: 4px 0;"><strong>Country Name:</strong> ${item.country || "Canada"}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0;"><strong>Club Badge Source:</strong> ${clubBadgeNote}</td>
              <td style="padding: 4px 0;"><strong>Country Flag Source:</strong> ${countryFlagNote}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0;"><strong>Card Font Color:</strong> <span style="display:inline-block; width:12px; height:12px; background:${item.textColor || "#3c3f25"}; border: 1px solid #cbd5e1; border-radius:50%; vertical-align: middle; margin-right:4px;"></span>${item.textColor || "#3c3f25"}</td>
              <td style="padding: 4px 0;"><strong>Add-ons:</strong> ${addonNames}</td>
            </tr>
          </table>

          <p style="margin: 10px 0 6px; font-size: 14px; background: #f8fafc; padding: 8px 10px; border-radius: 6px;">
            <strong>Attributes:</strong>
            PAC: <strong>${attrs.PAC ?? "N/A"}</strong> |
            SHO: <strong>${attrs.SHO ?? "N/A"}</strong> |
            PAS: <strong>${attrs.PAS ?? "N/A"}</strong> |
            DRI: <strong>${attrs.DRI ?? "N/A"}</strong> |
            DEF: <strong>${attrs.DEF ?? "N/A"}</strong> |
            PHY: <strong>${attrs.PHY ?? "N/A"}</strong>
          </p>

          <table style="width: 100%; margin-top: 16px; border-collapse: collapse;">
            <tr>
              ${
                parsedOrig
                  ? `<td style="vertical-align: top; padding-right: 10px; width: 33%;">
                      <p style="margin: 0 0 6px; font-size: 12px;"><strong>1. Original Photo (BG Not Removed):</strong></p>
                      <img src="cid:${origCid}" style="width: 100%; max-width: 185px; border-radius: 8px; border: 1px solid #cbd5e1; display: block;" />
                     </td>`
                  : ""
              }
              ${
                parsedCutout
                  ? `<td style="vertical-align: top; padding-right: 10px; width: 33%;">
                      <p style="margin: 0 0 6px; font-size: 12px;"><strong>2. BG-Removed Cutout:</strong></p>
                      <img src="cid:${cutoutCid}" style="width: 100%; max-width: 185px; border-radius: 8px; border: 1px solid #cbd5e1; background: #f1f5f9; display: block;" />
                     </td>`
                  : ""
              }
              ${
                parsedPreview
                  ? `<td style="vertical-align: top; width: 34%;">
                      <p style="margin: 0 0 6px; font-size: 12px;"><strong>3. Full Card Preview (with BG-Removed Photo):</strong></p>
                      <img src="cid:${cardCid}" style="width: 100%; max-width: 185px; border-radius: 8px; border: 1px solid #cbd5e1; display: block;" />
                     </td>`
                  : ""
              }
            </tr>
          </table>

          ${
            parsedCustomBadge || parsedCustomFlag
              ? `<table style="width: 100%; margin-top: 12px; border-top: 1px dashed #e2e8f0; padding-top: 10px;">
                  <tr>
                    ${
                      parsedCustomBadge
                        ? `<td style="vertical-align: top; padding-right: 12px;">
                            <p style="margin: 0 0 4px; font-size: 12px;"><strong>Custom Club Badge:</strong></p>
                            <img src="cid:${badgeCid}" style="height: 56px; width: auto; border-radius: 6px; border: 1px solid #cbd5e1;" />
                           </td>`
                        : ""
                    }
                    ${
                      parsedCustomFlag
                        ? `<td style="vertical-align: top;">
                            <p style="margin: 0 0 4px; font-size: 12px;"><strong>Custom Country Flag:</strong></p>
                            <img src="cid:${flagCid}" style="height: 44px; width: auto; border-radius: 4px; border: 1px solid #cbd5e1;" />
                           </td>`
                        : ""
                    }
                  </tr>
                 </table>`
              : ""
          }
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
      <div style="font-family: Arial, sans-serif; max-width: 680px; margin: 0 auto; color: #111; background: #f8fafc; padding: 20px; border-radius: 12px;">
        <h2 style="background: #232323; color: #fff; padding: 16px; text-align: center; border-radius: 8px; margin-top: 0;">
          🚀 New Paid Order Received (${orderRef})
        </h2>

        <div style="background: #fff; padding: 18px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 20px; font-size: 14px;">
          <h3 style="margin-top: 0; color: #0f172a; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">💳 Payment &amp; Customer Checkout Details</h3>
          <p style="margin: 6px 0;"><strong>Order Reference:</strong> ${orderRef}</p>
          ${totalPaid ? `<p style="margin: 6px 0;"><strong>Total Paid (Stripe):</strong> ${totalPaid}</p>` : ""}
          ${shippingMethodLabel ? `<p style="margin: 6px 0;"><strong>Shipping Method:</strong> ${shippingMethodLabel}</p>` : ""}
          ${promoCode ? `<p style="margin: 6px 0;"><strong>Promo Code Used:</strong> ${promoCode}</p>` : ""}
          ${stripeSessionId ? `<p style="margin: 6px 0;"><strong>Stripe Session ID:</strong> ${stripeSessionId}</p>` : ""}
          <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 10px 0;" />
          <p style="margin: 6px 0;"><strong>Customer Full Name:</strong> ${customerDetails.name}</p>
          <p style="margin: 6px 0;"><strong>Email Address:</strong> ${customerDetails.email}</p>
          <p style="margin: 6px 0;"><strong>Phone Number:</strong> ${customerDetails.phone}</p>
          ${customerDetails.streetAddress ? `<p style="margin: 6px 0;"><strong>Street Address:</strong> ${customerDetails.streetAddress}</p>` : ""}
          ${customerDetails.city || customerDetails.postcode ? `<p style="margin: 6px 0;"><strong>City / Postal Code:</strong> ${[customerDetails.city, customerDetails.postcode].filter(Boolean).join(", ")}</p>` : ""}
          ${customerDetails.country ? `<p style="margin: 6px 0;"><strong>Country:</strong> ${customerDetails.country}</p>` : ""}
          <p style="margin: 6px 0;"><strong>Full Shipping Address:</strong> ${customerDetails.address}</p>
          <p style="margin: 6px 0;"><strong>Promotional &amp; Social Media Consent:</strong> ${customerDetails.mediaConsent ? "Yes (Accepted)" : "N/A"}</p>
        </div>

        <h3 style="color: #0f172a;">🎴 Order Items &amp; Uploaded Design Files</h3>
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

    // 1. Send Complete Admin Production Email (with all original + BG-removed + preview + custom badge/flag attachments)
    const info = await transporter.sendMail({
      from: `"SAS Sports Orders" <${smtpUser}>`,
      to: adminRecipients.join(", "),
      replyTo: validCustomerEmail,
      subject: `Paid Order ${orderRef} from ${customerDetails.name} (${cartItems.length} Item${cartItems.length === 1 ? "" : "s"})`,
      html: adminHtmlContent,
      attachments,
    });

    // 2. Send Order Confirmation Receipt Email to Customer
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
                Thank you for your order! Your payment has been confirmed and our team is preparing your custom order.
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
