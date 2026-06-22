import { cookies } from "next/headers";
import { getContent, AB_COOKIE, type Variant } from "@/lib/content";
import HomeClient from "./HomeClient";

// Dinámica: la home se renderiza fresca en cada request con el contenido real
// del Blob. Así NUNCA se hornea un render estático con los valores por defecto
// (video viejo / sin testimonios). El caching del contenido se hace en memoria
// dentro de getContent (TTL corto), no a nivel página.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getContent();
  const c = await cookies();
  const variant: Variant = c.get(AB_COOKIE)?.value === "B" ? "B" : "A";
  return <HomeClient data={data} variant={variant} />;
}
