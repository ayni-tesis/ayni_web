import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { QueryProvider } from "@/lib/providers/query-provider";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AYNI Admin",
  description:
    "Panel administrativo del sistema AYNI — detección temprana de plagas en café",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${nunito.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
