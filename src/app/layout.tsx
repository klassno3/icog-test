import type { Metadata } from "next";
import { Barlow } from "next/font/google";
import "./globals.css";
import ClientWrapper from "@/utils/ClientWrapper";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import Navigation from "@/components/Navigation";

const barlowSans = Barlow({
  variable: "--font-barlow-sans",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "True Lease",
  description: "created by Betelhem Kirub",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${barlowSans.variable} antialiased`}>
        <ClientWrapper>
          <Toaster />
          <Navigation />
          {children}
          <Footer />
        </ClientWrapper>
        <div className="modal-container"></div>
      </body>
    </html>
  );
}
