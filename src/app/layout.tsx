import type { Metadata } from "next";
import "./globals.css";
import { FloatingWhatsAppButton } from "@/components/ui/FloatingWhatsAppButton";

export const metadata: Metadata = {
  title: "NeuroPsiEdu",
  description: "Excelência em Avaliação Neuropsicológica e Ensino",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className="antialiased">
        {children}
        <FloatingWhatsAppButton />
      </body>
    </html>
  );
}
