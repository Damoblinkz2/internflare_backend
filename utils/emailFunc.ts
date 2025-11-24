import nodemailer, { Transporter } from "nodemailer";

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
}

function buildNotificationTemplate(data: {
  title: string;
  message: string;
  buttonText?: string;
  buttonUrl?: string;
}) {
  return `
    <div style="font-family:Arial, sans-serif; max-width:600px; margin:auto; padding:20px; background:#f9fafb; border-radius:8px;">
      <h2 style="color:#111; margin-bottom:16px;">${data.title}</h2>
      <p style="font-size:15px; color:#444;">${data.message}</p>

      ${
        data.buttonText && data.buttonUrl
          ? `
        <a href="${data.buttonUrl}" 
           style="display:inline-block; margin-top:20px; padding:10px 18px; background:#2563eb; color:#fff; text-decoration:none; border-radius:6px;">
           ${data.buttonText}
        </a>`
          : ""
      }
    </div>
  `;
}

async function sendNotificationEmail(opts: {
  to: string;
  title: string;
  message: string;
  buttonText?: string;
  buttonUrl?: string;
}) {
  const mailer = getTransporter();

  const html = buildNotificationTemplate({
    title: opts.title,
    message: opts.message,
    buttonText: opts.buttonText,
    buttonUrl: opts.buttonUrl,
  });

  await mailer.sendMail({
    from: process.env.MAIL_FROM ?? "no-reply@internflare.com",
    to: opts.to,
    subject: opts.title,
    html,
  });
}

export default sendNotificationEmail;

// await sendNotificationEmail({
//   to: "user@example.com",
//   title: "Your Report Is Ready",
//   message: "The latest analytics report is now available in your dashboard.",
//   buttonText: "View Report",
//   buttonUrl: "https://example.com/reports/123",
// });
