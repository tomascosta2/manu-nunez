import { getContent } from "@/lib/content";
import { LegalPage } from "../legal/LegalPage";

export const revalidate = 60;

export const metadata = {
  title: "Términos y Condiciones — Manuel Núñez",
  description: "Términos y condiciones de uso del sitio y servicios de Manuel Núñez — Método M90.",
};

export default async function TermsPage() {
  const data = await getContent();
  return <LegalPage title="Términos y Condiciones" body={data.legalPages?.terms} />;
}
