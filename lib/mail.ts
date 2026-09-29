import nodemailer from "nodemailer";
import path from "path";

// ── Tier data ────────────────────────────────────────────────────────────────
const TIER_INFO: Record<string, { label: string; price: string }> = {
  BASIC: { label: "ΚΑΡΤΑ ΦΙΛΑΘΛΟΥ",       price: "20€"  },
  GOLD:  { label: "ΚΑΡΤΑ ΔΙΑΡΚΕΙΑΣ GOLD", price: "50€"  },
  VIP:   { label: "ΚΑΡΤΑ VIP / ΧΟΡΗΓΟΣ",  price: "100€" },
};

// Colors match MembershipClientUI.tsx TIERS array exactly
const TIER_STYLES: Record<string, {
  cardBg:      string;
  borderColor: string;
  accent:      string;
  badgeBg:     string;
  badgeText:   string;
  badgeLabel:  string;
}> = {
  BASIC: {
    cardBg:      "#111f17",
    borderColor: "#1e3d2a",
    accent:      "#9ca3af",
    badgeBg:     "#1e293b",
    badgeText:   "#9ca3af",
    badgeLabel:  "BASIC",
  },
  GOLD: {
    cardBg:      "#1a160b",
    borderColor: "#3a2e0e",
    accent:      "#C9A227",
    badgeBg:     "#C9A227",
    badgeText:   "#090d0a",
    badgeLabel:  "GOLD",
  },
  VIP: {
    cardBg:      "#160e22",
    borderColor: "#2e1d42",
    accent:      "#a78bfa",
    badgeBg:     "#3b0764",
    badgeText:   "#ede9fe",
    badgeLabel:  "VIP",
  },
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatDateGR(date: Date): string {
  return date.toLocaleDateString("el-GR", { day: "numeric", month: "long", year: "numeric" });
}

function expiryDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 10);
  return formatDateGR(d);
}

// ── Main export ───────────────────────────────────────────────────────────────
export async function sendMembershipConfirmationEmail(data: {
  id: number;
  fullName: string;
  email: string;
  tier: string;
  deliveryMethod: string;
  address?: string | null;
}) {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpUser || !smtpPass) {
    console.warn("[mail] SMTP_USER / SMTP_PASS not set — skipping confirmation email.");
    return;
  }

  const tier     = TIER_INFO[data.tier]   ?? { label: data.tier, price: "—" };
  const style    = TIER_STYLES[data.tier] ?? TIER_STYLES["BASIC"];
  const code     = `#AED-${data.id}`;
  const expiry   = expiryDate();
  const isPickup = data.deliveryMethod !== "SHIPPING";
  const f        = `font-family:'Oswald',Arial,sans-serif;`;

  // ── Delivery section ────────────────────────────────────────────────────────
  const deliverySection = isPickup ? `
        <tr>
          <td bgcolor="#0a1610" style="padding:0 40px 36px;">
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="border-left:3px solid #C9A227; border-radius:0 6px 6px 0; overflow:hidden;">
              <tr>
                <td bgcolor="#0d1c13" style="padding:18px 20px 22px;">
                  <p style="margin:0 0 14px; ${f} font-size:9px; letter-spacing:3px; font-weight:700; color:#C9A227; text-transform:uppercase;">Σημείο Παραλαβής</p>
                  <p style="margin:0 0 2px; ${f} font-size:14px; font-weight:700; color:#f1f5f9;">Γραφεία Α.Ε.Δ. 1933</p>
                  <p style="margin:0 0 18px; ${f} font-size:12px; color:#6b7280;">Δημοτικό Στάδιο Διδυμοτείχου</p>

                  <p style="margin:0 0 6px; ${f} font-size:9px; letter-spacing:3px; font-weight:700; color:#C9A227; text-transform:uppercase;">Ωράριο</p>
                  <p style="margin:0 0 3px; ${f} font-size:13px; color:#cbd5e1;">Δευτέρα – Παρασκευή &nbsp;<strong style="color:#ffffff;">18:00 – 20:30</strong></p>
                  <p style="margin:0 0 18px; ${f} font-size:12px; color:#6b7280;">Ημέρες εντός έδρας αγώνων (εκδοτήριο γηπέδου)</p>

                  <p style="margin:0 0 6px; ${f} font-size:9px; letter-spacing:3px; font-weight:700; color:#C9A227; text-transform:uppercase;">Προθεσμία Παραλαβής</p>
                  <p style="margin:0; ${f} font-size:13px; color:#cbd5e1; line-height:1.65;">
                    Η κράτηση ισχύει για <strong style="color:#ffffff;">10 ημέρες</strong> — έως <strong style="color:#C9A227;">${expiry}</strong>.<br>
                    Εξόφληση κατά την παραλαβή.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>` : `
        <tr>
          <td bgcolor="#0a1610" style="padding:0 40px 36px;">
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="border-left:3px solid #C9A227; border-radius:0 6px 6px 0; overflow:hidden;">
              <tr>
                <td bgcolor="#0d1c13" style="padding:18px 20px 22px;">
                  <p style="margin:0 0 14px; ${f} font-size:9px; letter-spacing:3px; font-weight:700; color:#C9A227; text-transform:uppercase;">Αποστολή Ταχυδρομικώς</p>
                  <p style="margin:0 0 4px; ${f} font-size:11px; letter-spacing:2px; color:#6b7280; text-transform:uppercase;">Διεύθυνση</p>
                  <p style="margin:0 0 14px; ${f} font-size:14px; font-weight:700; color:#f1f5f9;">${data.address ?? "—"}</p>
                  <p style="margin:0; ${f} font-size:13px; color:#cbd5e1; line-height:1.65;">
                    Η διοίκηση της Α.Ε.Δ. θα επικοινωνήσει μαζί σας τηλεφωνικά εντός
                    <strong style="color:#ffffff;">2 εργάσιμων ημερών</strong> για επιβεβαίωση και αποστολή.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>`;

  // ── Full HTML ───────────────────────────────────────────────────────────────
  const html = `<!DOCTYPE html>
<html lang="el">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <title>Επιβεβαίωση Κράτησης — Α.Ε. Διδυμοτείχου 1933</title>
  <style>
    body { margin:0; padding:0; background-color:#050b08; }
    @media only screen and (max-width:600px) {
      .wrap  { padding:16px 8px !important; }
      .card  { border-radius:8px !important; }
      .inner { padding-left:20px !important; padding-right:20px !important; }
      .info-cols td { display:block !important; width:100% !important; border-right:none !important; padding:10px 0 !important; }
    }
  </style>
</head>
<body bgcolor="#050b08" style="margin:0; padding:0; background-color:#050b08;">

<table width="100%" cellpadding="0" cellspacing="0" bgcolor="#050b08">
  <tr>
    <td align="center" class="wrap" style="padding:40px 16px;">

      <!-- MAIN CARD -->
      <table width="600" cellpadding="0" cellspacing="0" class="card"
             style="max-width:600px; width:100%; background-color:#0a1610; border:1px solid #132b1c; border-radius:12px; overflow:hidden;">

        <!-- TOP ACCENT LINE -->
        <tr>
          <td bgcolor="#C9A227" height="3" style="font-size:0; line-height:0;">&nbsp;</td>
        </tr>

        <!-- HEADER -->
        <tr>
          <td bgcolor="#0a1610" class="inner" style="padding:44px 40px 32px; text-align:center;">
            <img src="cid:aedlogo" width="90" height="90" alt="Α.Ε. Διδυμοτείχου 1933"
                 style="display:block; margin:0 auto 24px;" />
            <p style="margin:0 0 12px; ${f} font-size:10px; font-weight:700; letter-spacing:4px; color:#C9A227; text-transform:uppercase;">
              Α.Ε. ΔΙΔΥΜΟΤΕΙΧΟΥ 1933
            </p>
            <p style="margin:0; ${f} font-size:32px; font-weight:700; letter-spacing:1.5px; color:#ffffff; text-transform:uppercase; line-height:1.1;">
              ΕΠΙΒΕΒΑΙΩΣΗ<br>ΚΡΑΤΗΣΗΣ
            </p>
          </td>
        </tr>

        <!-- DIVIDER -->
        <tr>
          <td style="padding:0 40px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td bgcolor="#1a2e20" height="1" style="font-size:0; line-height:0;">&nbsp;</td></tr>
            </table>
          </td>
        </tr>

        <!-- GREETING -->
        <tr>
          <td bgcolor="#0a1610" class="inner" style="padding:28px 40px 24px;">
            <p style="margin:0; ${f} font-size:14px; color:#a1a1aa; line-height:1.75;">
              Αγαπητέ/ή <strong style="color:#f4f4f5;">${data.fullName}</strong>,<br>
              η κράτησή σας για κάρτα μέλους της Α.Ε. Διδυμοτείχου 1933 καταχωρήθηκε επιτυχώς.
            </p>
          </td>
        </tr>

        <!-- MEMBERSHIP PASS CARD -->
        <tr>
          <td class="inner" style="padding:0 40px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="background-color:${style.cardBg}; border:1px solid ${style.borderColor}; border-radius:10px; overflow:hidden;">

              <!-- Pass top: label + tier badge -->
              <tr>
                <td bgcolor="${style.cardBg}" style="padding:16px 20px 12px; border-bottom:1px solid ${style.borderColor};">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="vertical-align:middle;">
                        <p style="margin:0; ${f} font-size:9px; letter-spacing:4px; color:rgba(255,255,255,0.3); text-transform:uppercase;">ΚΑΡΤΑ ΜΕΛΟΥΣ &bull; SEASON PASS</p>
                      </td>
                      <td style="vertical-align:middle; text-align:right;">
                        <table cellpadding="0" cellspacing="0" align="right">
                          <tr>
                            <td bgcolor="${style.badgeBg}" style="border-radius:4px; padding:3px 12px;">
                              <p style="margin:0; ${f} font-size:10px; font-weight:800; letter-spacing:3px; color:${style.badgeText}; text-transform:uppercase; white-space:nowrap;">${style.badgeLabel}</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Pass middle: booking code -->
              <tr>
                <td bgcolor="${style.cardBg}" style="padding:20px 20px 16px;">
                  <p style="margin:0 0 4px; ${f} font-size:9px; letter-spacing:3px; color:rgba(255,255,255,0.28); text-transform:uppercase;">Κωδικός Κράτησης</p>
                  <p style="margin:0; ${f} font-size:34px; font-weight:900; color:${style.accent}; white-space:nowrap; letter-spacing:1px; line-height:1;">${code}</p>
                </td>
              </tr>

              <!-- Pass bottom: 3-col info -->
              <tr>
                <td style="border-top:1px solid ${style.borderColor}; padding:0;">
                  <table width="100%" cellpadding="0" cellspacing="0" class="info-cols">
                    <tr>
                      <td bgcolor="${style.cardBg}" style="padding:12px 20px; vertical-align:top; width:50%; border-right:1px solid ${style.borderColor};">
                        <p style="margin:0 0 3px; ${f} font-size:8px; letter-spacing:3px; color:rgba(255,255,255,0.28); text-transform:uppercase;">ΚΑΤΟΧΟΣ</p>
                        <p style="margin:0; ${f} font-size:13px; font-weight:700; color:#ffffff;">${data.fullName}</p>
                      </td>
                      <td bgcolor="${style.cardBg}" style="padding:12px 20px; vertical-align:top; width:30%; border-right:1px solid ${style.borderColor};">
                        <p style="margin:0 0 3px; ${f} font-size:8px; letter-spacing:3px; color:rgba(255,255,255,0.28); text-transform:uppercase;">ΠΑΚΕΤΟ</p>
                        <p style="margin:0; ${f} font-size:11px; font-weight:700; color:${style.accent}; line-height:1.3;">${tier.label}</p>
                      </td>
                      <td bgcolor="${style.cardBg}" style="padding:12px 20px; vertical-align:top; width:20%; text-align:right;">
                        <p style="margin:0 0 3px; ${f} font-size:8px; letter-spacing:3px; color:rgba(255,255,255,0.28); text-transform:uppercase;">ΑΞΙΑ</p>
                        <p style="margin:0; ${f} font-size:22px; font-weight:900; color:${style.accent}; white-space:nowrap;">${tier.price}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

            </table>
          </td>
        </tr>

        <!-- SECTION LABEL -->
        <tr>
          <td bgcolor="#0a1610" class="inner" style="padding:0 40px 12px;">
            <p style="margin:0; ${f} font-size:9px; letter-spacing:4px; font-weight:700; color:rgba(255,255,255,0.2); text-transform:uppercase;">${isPickup ? "Οδηγίες Παραλαβής" : "Στοιχεία Αποστολής"}</p>
          </td>
        </tr>

        <!-- DELIVERY SECTION -->
        ${deliverySection}

        <!-- CTA BUTTON -->
        <tr>
          <td bgcolor="#0a1610" style="padding:8px 40px 36px; text-align:center;">
            <table cellpadding="0" cellspacing="0" align="center">
              <tr>
                <td bgcolor="#C9A227" style="border-radius:6px;">
                  <a href="https://aedidimotico.gr"
                     style="display:inline-block; ${f} font-size:12px; font-weight:800; letter-spacing:3px; color:#050b08; text-decoration:none; text-transform:uppercase; padding:13px 28px; white-space:nowrap;">
                    ΕΠΙΣΤΡΟΦΗ ΣΤΗΝ ΙΣΤΟΣΕΛΙΔΑ
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td bgcolor="#071209" style="padding:18px 40px 22px; text-align:center; border-top:1px solid #132b1c;">
            <p style="margin:0 0 5px; ${f} font-size:11px; color:#4b5563;">Για απορίες: <span style="color:#C9A227;">${smtpUser}</span></p>
            <p style="margin:0; ${f} font-size:10px; letter-spacing:2px; color:#334155; text-transform:uppercase;">© ${new Date().getFullYear()} Α.Ε. Διδυμοτείχου 1933</p>
          </td>
        </tr>

      </table>
      <!-- /MAIN CARD -->

    </td>
  </tr>
</table>

</body>
</html>`;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: smtpUser, pass: smtpPass },
  });

  try {
    await transporter.sendMail({
      from: `"Α.Ε. Διδυμοτείχου 1933" <${smtpUser}>`,
      to: data.email,
      subject: `[${code}] Επιβεβαίωση Κράτησης Κάρτας — Α.Ε. Διδυμοτείχου 1933`,
      html,
      attachments: [
        {
          filename: "logo2.png",
          path: path.join(process.cwd(), "public", "logo2.png"),
          cid: "aedlogo",
        },
      ],
    });
  } catch (err) {
    console.error("[mail] Failed to send confirmation email:", err);
  }
}
