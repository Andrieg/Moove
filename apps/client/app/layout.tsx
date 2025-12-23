import type { Metadata } from "next";
import "./globals.css";
import MainLayout from "./_components/layout/MainLayout";

export const metadata: Metadata = {
  title: "Moove - Fitness Platform",
  description: "Access your workouts, challenges, and fitness journey",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased" style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
