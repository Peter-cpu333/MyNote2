import type { Metadata } from "next";
import "./globals.css";
import FloatingChat from '../components/FloatingChat';

export const metadata: Metadata = {
  title: "我的笔记",
  description: "个人笔记管理系统",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className="antialiased">
        {children}
        <FloatingChat />
      </body>
    </html>
  );
}
