import { cookies } from "next/headers";
import { getContent, AB_COOKIE, type Variant } from "@/lib/content";
import HomeClient from "./HomeClient";

export const revalidate = 60;

export default async function HomePage() {
  const data = await getContent();
  const c = await cookies();
  const variant: Variant = c.get(AB_COOKIE)?.value === "B" ? "B" : "A";
  return <HomeClient data={data} variant={variant} />;
}
