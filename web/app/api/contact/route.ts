import crypto from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendContactNotification } from "@/lib/mail";

const schema = z.object({
  name: z.string().trim().min(1).max(200),
  contact: z.string().trim().min(1).max(200),
  projectType: z.string().trim().min(1).max(200),
  budget: z.string().trim().min(1).max(200),
  message: z.string().trim().max(5000).optional(),
});

function hashIp(ip: string) {
  return crypto.createHash("sha256").update(`${ip}:${process.env.SESSION_SECRET ?? ""}`).digest("hex");
}

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Merci de renseigner votre nom et un moyen de vous contacter." }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  await prisma.contactRequest.create({
    data: {
      name: parsed.data.name,
      contact: parsed.data.contact,
      projectType: parsed.data.projectType,
      budget: parsed.data.budget,
      message: parsed.data.message ?? "",
      ipHash: hashIp(ip),
    },
  });

  const settings = await prisma.settings.findUnique({ where: { id: "settings" } });
  if (settings?.contactEmail) {
    try {
      await sendContactNotification(settings.contactEmail, {
        name: parsed.data.name,
        contact: parsed.data.contact,
        projectType: parsed.data.projectType,
        budget: parsed.data.budget,
        message: parsed.data.message ?? "",
      });
    } catch {
      // The request is already saved and visible in /admin/contact-requests
      // even if the notification email fails (unconfigured SMTP, etc.) —
      // never fail the visitor's submission because of our own mail setup.
    }
  }

  return NextResponse.json({ ok: true });
}
