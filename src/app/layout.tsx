import type { Metadata } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { LookTracker } from "@/components/cat/look-tracker";
import { AppEffects } from "@/components/app/app-effects";
import { Toaster } from "@/components/ui/sonner";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-baloo",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Catz",
  description: "Cat training that starts with your cat.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={cn("h-full antialiased", baloo.variable, nunito.variable)}>
      <body className="min-h-dvh">
        <LookTracker />
        <AppEffects />
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
