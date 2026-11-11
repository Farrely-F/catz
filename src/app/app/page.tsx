"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppFrame } from "@/components/app/app-frame";
import { Splash } from "@/components/app/splash";
import { useCatz } from "@/lib/store";

/** App entry (the PWA start URL). Sends new users to setup and returning users to their path. */
export default function AppEntry() {
  const state = useCatz();
  const router = useRouter();
  const onboarded = state?.onboarded;

  useEffect(() => {
    if (onboarded === undefined) return;
    router.replace(onboarded ? "/app/path" : "/onboarding/avatar");
  }, [onboarded, router]);

  return (
    <AppFrame>
      <Splash />
    </AppFrame>
  );
}
