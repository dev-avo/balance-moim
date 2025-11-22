import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/session-provider";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "밸런스 모임 - Balance Moim",
  description: "밸런스 질문으로 취향을 나누고, 모임 친구들과 비교하며 서로를 알아가세요",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <div className="flex-1 flex">
              <Sidebar className="hidden lg:block" />
              <main className="flex-1 container py-6 px-4 lg:px-8">
                {children}
              </main>
            </div>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
