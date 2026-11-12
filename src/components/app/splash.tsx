import { CatAvatar } from "@/components/cat/cat-avatar";
import { DEFAULT_LOOK } from "@/lib/cat";

/** Shown on the server and until the local store has loaded. */
export function Splash() {
  return (
    <div className="flex flex-1 items-center justify-center" role="status" aria-label="Loading">
      <CatAvatar look={DEFAULT_LOOK} head className="w-24 animate-bob" />
    </div>
  );
}
