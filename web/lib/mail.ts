import nodemailer from "nodemailer";

function transport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

export async function sendContactNotification(to: string, data: { name: string; contact: string; projectType: string; budget: string; message: string }) {
  const t = transport();
  if (!t || !to) return;
  const from = process.env.MAIL_FROM || process.env.SMTP_USER;
  await t.sendMail({
    from,
    to,
    replyTo: data.contact,
    subject: `Nouvelle demande de contact — ${data.name}`,
    text: [
      `Nom : ${data.name}`,
      `Contact : ${data.contact}`,
      `Type de projet : ${data.projectType}`,
      `Budget : ${data.budget}`,
      "",
      data.message || "(aucun message)",
    ].join("\n"),
  });
}
