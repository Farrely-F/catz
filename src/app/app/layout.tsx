import type { Metadata } from "next";
import { AppShell } from "@/components/app/app-shell";

// The app is private and lives on the device, so keep it out of search results.
export const metadata: Metadata = {
  title: "Training",
  robots: { index: false, follow: false },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
