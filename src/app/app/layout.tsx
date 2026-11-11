"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AppFrame } from "@/components/app/app-frame";
import { Splash } from "@/components/app/splash";
import { TabBar } from "@/components/app/tab-bar";
import { useCatz } from "@/lib/store";

/** Shell for everything after setup: guards onboarding and shows the tab bar on the main tabs. */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const state = useCatz();
  const router = useRouter();
  const pathname = usePathname();
  const onboarded = state?.onboarded;

  useEffect(() => {
    if (onboarded === false) router.replace("/onboarding/avatar");
  }, [onboarded, router]);

  const ready = onboarded === true;
  const tabs = ready && pathname !== "/app" && !pathname.startsWith("/app/lesson") && pathname !== "/app/win";

  return (
    <AppFrame>
      {ready ? (
        <div key={pathname} className="flex min-h-0 flex-1 animate-fade-up flex-col">
          {children}
        </div>
      ) : (
        <Splash />
      )}
      {tabs && <TabBar />}
    </AppFrame>
  );
}
