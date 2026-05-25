import { cookies } from "next/headers";
import { getContent } from "@/lib/content";
import { AB_COOKIE, pickVariant, isTestActive, type Variant } from "@/lib/ab-cookie";
import ThankyouClient from "./ThankyouClient";

export const revalidate = 60;

export default async function ThankyouPage() {
  const data = await getContent();
  const c = await cookies();
  const variant: Variant = c.get(AB_COOKIE)?.value === "B" ? "B" : "A";
  const t = data.activeTestId;

  const title = pickVariant(data.thankyouPage?.title, variant, isTestActive(t, "thankyouPage.title")) || "";
  const subtitle = pickVariant(data.thankyouPage?.subtitle, variant, isTestActive(t, "thankyouPage.subtitle")) || "";
  const whatsappCtaText = pickVariant(data.thankyouPage?.whatsappCtaText, variant, isTestActive(t, "thankyouPage.whatsappCtaText")) || "Confirmar mi asistencia por WhatsApp";
  const whatsappPrefilledMessage = pickVariant(data.thankyouPage?.whatsappPrefilledMessage, variant, isTestActive(t, "thankyouPage.whatsappPrefilledMessage")) || "";
  const videoEmbedUrl = pickVariant(data.thankyouPage?.videoEmbedUrl, variant, isTestActive(t, "thankyouPage.videoEmbedUrl")) || "";
  const loomEmbedUrl = pickVariant(data.thankyouPage?.loomEmbedUrl, variant, isTestActive(t, "thankyouPage.loomEmbedUrl")) || "";
  const loomSectionHeading = pickVariant(data.thankyouPage?.loomSectionHeading, variant, isTestActive(t, "thankyouPage.loomSectionHeading")) || "";
  const introVideoUrl = pickVariant(data.thankyouPage?.introVideoUrl, variant, isTestActive(t, "thankyouPage.introVideoUrl")) || "";
  const whatsappNumber = data.siteConfig?.whatsappNumber || "5492216720769";

  const faqs = (data.thankyouPage?.faqs ?? []).map((f) => ({
    _id: f._id,
    question: pickVariant(f.question, variant, isTestActive(t, `thankyouPage.faq.${f._id}.q`)) || "",
    answer: pickVariant(f.answer, variant, isTestActive(t, `thankyouPage.faq.${f._id}.a`)) || "",
  })).filter((f) => f.question && f.answer);

  const urgentBanner = pickVariant(data.thankyouPage?.urgentBanner, variant, isTestActive(t, "thankyouPage.urgentBanner")) || "";
  const checklistLabel = pickVariant(data.thankyouPage?.checklistLabel, variant, isTestActive(t, "thankyouPage.checklistLabel")) || "";
  const check1 = pickVariant(data.thankyouPage?.check1, variant, isTestActive(t, "thankyouPage.check1")) || "";
  const check2 = pickVariant(data.thankyouPage?.check2, variant, isTestActive(t, "thankyouPage.check2")) || "";
  const check3 = pickVariant(data.thankyouPage?.check3, variant, isTestActive(t, "thankyouPage.check3")) || "";
  const cancellationWarning = pickVariant(data.thankyouPage?.cancellationWarning, variant, isTestActive(t, "thankyouPage.cancellationWarning")) || "";
  const videoSectionHeading = pickVariant(data.thankyouPage?.videoSectionHeading, variant, isTestActive(t, "thankyouPage.videoSectionHeading")) || "";
  const faqHeading = pickVariant(data.thankyouPage?.faqHeading, variant, isTestActive(t, "thankyouPage.faqHeading")) || "";
  const scarcityMessage = pickVariant(data.thankyouPage?.scarcityMessage, variant, isTestActive(t, "thankyouPage.scarcityMessage")) || "";

  const galleryItems = (data.resultGallery ?? []).map((r) => ({
    _id: r._id,
    weight: r.weight ?? "",
    image: r.afterImageUrl || r.beforeImageUrl || r.imageUrl || "",
  })).filter((g) => g.image);

  return (
    <ThankyouClient
      title={title}
      subtitle={subtitle}
      whatsappCtaText={whatsappCtaText}
      whatsappPrefilledMessage={whatsappPrefilledMessage}
      videoEmbedUrl={videoEmbedUrl}
      loomEmbedUrl={loomEmbedUrl}
      loomSectionHeading={loomSectionHeading}
      introVideoUrl={introVideoUrl}
      whatsappNumber={whatsappNumber}
      faqs={faqs}
      urgentBanner={urgentBanner}
      checklistLabel={checklistLabel}
      check1={check1}
      check2={check2}
      check3={check3}
      cancellationWarning={cancellationWarning}
      videoSectionHeading={videoSectionHeading}
      faqHeading={faqHeading}
      scarcityMessage={scarcityMessage}
      galleryItems={galleryItems}
    />
  );
}
