import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Sidebar } from "@/components/sidebar/sidebar";
import { SidebarProvider } from "@/components/sidebar/sidebar-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vaultify — Password Manager",
  description: "Vaultify é um gerenciador de senhas desenvolvido para fins de portfólio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SidebarProvider>
          <Sidebar />
          <main className="flex flex-1 flex-col lg:pl-64">{children}</main>
        </SidebarProvider>
      </body>
    </html>
  );
}
