import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Optimal Remittance - Portail Opérations & Administration",
  description: "Plateforme de gestion de transfert d'argent international (Afrique Centrale vers Maroc)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
