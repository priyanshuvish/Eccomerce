import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "./providers";
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FlipStore - Your Shopping Destination",
  description: "Shop the best products at amazing prices",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <AuthProvider>
            <Navbar />
            <main className="min-h-screen bg-gray-50">
              {children}
            </main>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}