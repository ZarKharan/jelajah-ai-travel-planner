import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jelajah — AI Travel Planner",
  description: "Rencanakan perjalanan Indonesia dengan itinerary yang personal, peta interaktif, dan estimasi biaya yang transparan."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
