import { getContent } from "@/lib/content";
import { Shell } from "./Shell";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const initial = await getContent();
  return <Shell initial={initial}>{children}</Shell>;
}
