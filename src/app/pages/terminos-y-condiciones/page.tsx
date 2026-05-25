import { getContent } from "@/lib/content";
import { LegalPage } from "../legal/LegalPage";

export const revalidate = 60;

export const metadata = {
  title: "Términos y Condiciones — Mathías Guevara",
  description: "Términos y condiciones de uso del sitio y servicios de Mathías Guevara — Método Impulso Profesional.",
};

export default async function TermsPage() {
  const data = await getContent();
  return <LegalPage title="Términos y Condiciones" body={data.legalPages?.terms} />;
}
