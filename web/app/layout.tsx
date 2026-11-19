import type { Metadata } from "next";
import Chrome from "@/components/chrome/Chrome";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Ets Paradise Assistance — Architecture d'intérieur",
    template: "%s — Ets Paradise Assistance",
  },
  description:
    "Ets Paradise Assistance conçoit et réalise cuisines, dressings, murs TV et aménagements d'intérieur sur mesure.",
  icons: {
    icon: "/img/icone.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Poppins:wght@300;400;500;600&display=swap"
        />
      </head>
      <body>
        <Chrome>{children}</Chrome>
      </body>
    </html>
  );
}
