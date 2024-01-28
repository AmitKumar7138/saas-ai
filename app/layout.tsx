import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ModalProvide } from "@/components/model-provider";
import ToasterProvider from "@/components/toaster-provider";
import { CrispProvider } from "@/components/crisp-provide";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Imagine",
  description: "AI Genrator Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <CrispProvider />
        <body className={inter.className}>
          <ModalProvide />
          <ToasterProvider />
          {children}</body>
      </html>
    </ClerkProvider>
  );
}
