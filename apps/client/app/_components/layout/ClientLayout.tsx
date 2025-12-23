"use client";

import dynamic from "next/dynamic";

const MainLayout = dynamic(() => import("./MainLayout"), {
  ssr: false,
  loading: () => null,
});

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <MainLayout>{children}</MainLayout>;
}
