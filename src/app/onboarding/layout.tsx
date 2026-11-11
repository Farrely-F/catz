import type { Metadata } from "next";
import { OnboardingShell } from "@/components/app/onboarding-shell";

export const metadata: Metadata = {
  title: "Set up your cat",
  robots: { index: false, follow: false },
};

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return <OnboardingShell>{children}</OnboardingShell>;
}
