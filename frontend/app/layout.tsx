import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoHub - Агрегатор автосервисов",
  description: "Найдите лучший автосервис в вашем городе",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
