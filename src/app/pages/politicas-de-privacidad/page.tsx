import { getContent } from "@/lib/content";
import { LegalPage } from "../legal/LegalPage";

export const revalidate = 60;

export const metadata = {
  title: "Política de Privacidad — Mathías Guevara",
  description: "Política de privacidad del sitio y servicios de Mathías Guevara — Método Impulso Profesional.",
};

export default async function PrivacyPage() {
  const data = await getContent();
  return <LegalPage title="Política de Privacidad" body={data.legalPages?.privacy} />;
}
