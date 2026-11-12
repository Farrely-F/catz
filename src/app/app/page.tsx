"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Splash } from "@/components/app/splash";
import { useCatz } from "@/lib/store";

/** App entry (the PWA start URL). The layout sends new users to setup; this sends returning users to their path. */
export default function AppEntry() {
  const onboarded = useCatz()?.onboarded;
  const router = useRouter();

  useEffect(() => {
    if (onboarded) router.replace("/app/path");
  }, [onboarded, router]);

  return <Splash />;
}
