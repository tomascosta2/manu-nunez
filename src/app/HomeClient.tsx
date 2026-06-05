"use client";

import { useEffect, useState } from "react";
import CalificationFormDirect, { type FormLabelsResolved } from "./components/CalificationFormDirect";
import CalendlyInline from "./components/CalendlyInline";
import { type AB, pickVariant, isTestActive, type Variant } from "@/lib/ab-cookie";

type SiteConfig = { whatsappNumber?: string; calendlyUrl?: string; pixelId?: string; hotjarId?: string } | null;
type Hero = {
  eyebrow?: AB; headline?: AB; description?: AB; vslEmbedUrl?: AB; pdText?: AB; ctaText?: AB; guaranteeText?: AB;
  socialProofVisible?: boolean; showStars?: boolean; socialProofImageUrl?: string;
} | null;
type HomeSections = {
  testimonialsHeadline?: AB; testimonialsCta?: AB; testimonialsCtaSubtext?: AB;
  resultsHeadline?: AB; resultsSubheading?: AB; resultsOverlayLabel?: AB;
  resultsCalloutText?: AB; resultsFinalCtaSubtext?: AB;
} | null;
type Footer = { brandLine?: AB; copyright?: AB; metaDisclaimer?: AB; privacyLabel?: AB; termsLabel?: AB } | null;
type CalendlyPageData = { pdText?: AB; urgentHeadline?: AB } | null;
type FormLabelsData = {
  nameLabel?: AB; namePlaceholder?: AB; emailLabel?: AB; emailPlaceholder?: AB;
  phoneLabel?: AB; countryPlaceholder?: AB; numberPlaceholder?: AB;
  phoneInvalidMessage?: AB; phoneInvalidHint?: AB; objectiveTip?: AB;
  backButton?: AB; nextButton?: AB; loadingButton?: AB; submitButton?: AB;
} | null;
type ResultGalleryItem = { _id: string; weight?: string; imageUrl?: string; beforeImageUrl?: string; afterImageUrl?: string };
type VideoTestimonial = { _id: string; videoUrl?: string; titulo?: string; story?: string; nombre?: string; dato?: string };

export type HomeData = {
  siteConfig?: SiteConfig;
  hero?: Hero;
  homeSections?: HomeSections;
  footer?: Footer;
  resultGallery?: ResultGalleryItem[];
  videoTestimonials?: VideoTestimonial[];
  calendlyPage?: CalendlyPageData;
  formLabels?: FormLabelsData;
  formQuestions?: unknown[];
  activeTestId?: string;
};

export default function HomeClient({ data, variant }: { data: HomeData; variant: Variant }) {
  const activeTestId = data.activeTestId;
  const [isFormOpened, setIsFormOpened] = useState(false);
  const [showCalendly, setShowCalendly] = useState(false);
  const [calendlyPrefill, setCalendlyPrefill] = useState<{ name: string; email: string; phone: string } | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "PageView");
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsUnlocked(true), 0 * 60 * 1000);
    return () => clearTimeout(timer);
  }, []);

  const eyebrow = pickVariant(data.hero?.eyebrow, variant, isTestActive(activeTestId, "hero.eyebrow")) || "";
  const headline = pickVariant(data.hero?.headline, variant, isTestActive(activeTestId, "hero.headline")) || "";
  const description = pickVariant(data.hero?.description, variant, isTestActive(activeTestId, "hero.description")) || "";
  const vslEmbedUrl = pickVariant(data.hero?.vslEmbedUrl, variant, isTestActive(activeTestId, "hero.vslEmbedUrl")) || "";
  const heroCta = pickVariant(data.hero?.ctaText, variant, isTestActive(activeTestId, "hero.ctaText")) || "Agendar";
  const heroGuarantee = pickVariant(data.hero?.guaranteeText, variant, isTestActive(activeTestId, "hero.guaranteeText")) || "";
  const testimonialsHeadline = pickVariant(data.homeSections?.testimonialsHeadline, variant, isTestActive(activeTestId, "homeSections.testimonialsHeadline")) || "";
  const resultsHeadline = pickVariant(data.homeSections?.resultsHeadline, variant, isTestActive(activeTestId, "homeSections.resultsHeadline")) || testimonialsHeadline;
  const resultsSubheading = pickVariant(data.homeSections?.resultsSubheading, variant, isTestActive(activeTestId, "homeSections.resultsSubheading")) || "";
  const resultsOverlayLabel = pickVariant(data.homeSections?.resultsOverlayLabel, variant, isTestActive(activeTestId, "homeSections.resultsOverlayLabel")) || "";
  const resultsCalloutText = pickVariant(data.homeSections?.resultsCalloutText, variant, isTestActive(activeTestId, "homeSections.resultsCalloutText")) || "";
  const testimonialsCta = pickVariant(data.homeSections?.testimonialsCta, variant, isTestActive(activeTestId, "homeSections.testimonialsCta")) || heroCta;
  const testimonialsCtaSubtext = pickVariant(data.homeSections?.testimonialsCtaSubtext, variant, isTestActive(activeTestId, "homeSections.testimonialsCtaSubtext")) || "";
  // Footer: si los campos están vacíos (cliente los borró por error o nunca los guardó),
  // mostramos un fallback razonable para que el footer NUNCA quede sin disclaimer legal.
  const footerBrand = pickVariant(data.footer?.brandLine, variant, isTestActive(activeTestId, "footer.brandLine")) || "Manu Nuñez Fit";
  const footerCopyrightTpl = pickVariant(data.footer?.copyright, variant, isTestActive(activeTestId, "footer.copyright")) || "© Manu Nuñez {year}. Todos los derechos reservados.";
  const footerMetaDisclaimer = pickVariant(data.footer?.metaDisclaimer, variant, isTestActive(activeTestId, "footer.metaDisclaimer")) || "Este sitio no forma parte ni está avalado por Meta (Facebook o Instagram). Facebook e Instagram son marcas registradas de Meta Platforms, Inc.";
  const calendlyUrgentHeadline = pickVariant(data.calendlyPage?.urgentHeadline, variant, isTestActive(activeTestId, "calendlyPage.urgentHeadline")) || "";
  const calendlyPdText = pickVariant(data.calendlyPage?.pdText, variant, isTestActive(activeTestId, "calendlyPage.pdText")) || "";

  const fl = data.formLabels;
  const formLabels: FormLabelsResolved = {
    nameLabel: pickVariant(fl?.nameLabel, variant, isTestActive(activeTestId, "formLabels.nameLabel")) || undefined,
    namePlaceholder: pickVariant(fl?.namePlaceholder, variant, isTestActive(activeTestId, "formLabels.namePlaceholder")) || undefined,
    emailLabel: pickVariant(fl?.emailLabel, variant, isTestActive(activeTestId, "formLabels.emailLabel")) || undefined,
    emailPlaceholder: pickVariant(fl?.emailPlaceholder, variant, isTestActive(activeTestId, "formLabels.emailPlaceholder")) || undefined,
    phoneLabel: pickVariant(fl?.phoneLabel, variant, isTestActive(activeTestId, "formLabels.phoneLabel")) || undefined,
    countryPlaceholder: pickVariant(fl?.countryPlaceholder, variant, isTestActive(activeTestId, "formLabels.countryPlaceholder")) || undefined,
    numberPlaceholder: pickVariant(fl?.numberPlaceholder, variant, isTestActive(activeTestId, "formLabels.numberPlaceholder")) || undefined,
    phoneInvalidMessage: pickVariant(fl?.phoneInvalidMessage, variant, isTestActive(activeTestId, "formLabels.phoneInvalidMessage")) || undefined,
    phoneInvalidHint: pickVariant(fl?.phoneInvalidHint, variant, isTestActive(activeTestId, "formLabels.phoneInvalidHint")) || undefined,
    objectiveTip: pickVariant(fl?.objectiveTip, variant, isTestActive(activeTestId, "formLabels.objectiveTip")) || undefined,
    backButton: pickVariant(fl?.backButton, variant, isTestActive(activeTestId, "formLabels.backButton")) || undefined,
    nextButton: pickVariant(fl?.nextButton, variant, isTestActive(activeTestId, "formLabels.nextButton")) || undefined,
    loadingButton: pickVariant(fl?.loadingButton, variant, isTestActive(activeTestId, "formLabels.loadingButton")) || undefined,
    submitButton: pickVariant(fl?.submitButton, variant, isTestActive(activeTestId, "formLabels.submitButton")) || undefined,
  };

  const VIDEO_TESTIMONIALS = (data.videoTestimonials ?? []).filter((t) => t.videoUrl);

  const TESTIMONIALS = (data.resultGallery ?? []).map((r) => {
    const before = r.beforeImageUrl || "";
    const after = r.afterImageUrl || "";
    const hasPair = !!(before && after);
    const single = !hasPair ? (after || before || r.imageUrl || "/images/placeholder.svg") : null;
    return {
      weight: r.weight ?? "",
      before,
      after,
      hasPair,
      single,
      img: after || before || r.imageUrl || "/images/placeholder.svg",
    };
  });

  const altImgGeneric = "Manu Nuñez - Fit";

  return (
    <>
      {(calendlyPrefill !== null || showCalendly) && (
        <div
          style={{
            opacity: showCalendly ? 1 : 0,
            pointerEvents: showCalendly ? "auto" : "none",
            position: showCalendly ? "relative" : "fixed",
            inset: showCalendly ? "auto" : "0",
            zIndex: showCalendly ? "auto" : 0,
          }}
        >
          <CalendlyInline
            name={calendlyPrefill?.name ?? ""}
            email={calendlyPrefill?.email ?? ""}
            phone={calendlyPrefill?.phone ?? ""}
            urgentHeadline={calendlyUrgentHeadline}
            pdText={calendlyPdText}
            calendlyUrl={data.siteConfig?.calendlyUrl}
          />
        </div>
      )}

      {!showCalendly && (
        <div className="relative overflow-clip pt-12">
          <img
            src="/images/Sombra.webp"
            alt="Sombra"
            className="w-[700px] absolute right-0 top-0 -z-50 hidden md:block"
          />
          <img
            src="/images/Sombra.webp"
            alt="Sombra"
            className="w-[700px] absolute left-0 top-0 scale-x-[-1] -z-50 hidden md:block"
          />
          <div className="bg-[var(--primary)]/80 size-[600px] rounded-full left-1/2 transform hidden md:block -translate-x-1/2 absolute -z-50 blur-[800px] -top-[400px]"></div>

          {isFormOpened && (
            <CalificationFormDirect
              variant={variant}
              questions={data.formQuestions as any}
              labels={formLabels}
              onClose={() => setIsFormOpened(false)}
              onContactReady={(name, email, phone) => setCalendlyPrefill({ name, email, phone })}
              onCalendly={() => {
                setIsFormOpened(false);
                setShowCalendly(true);
                window.history.pushState(null, "", "?calendario");
              }}
            />
          )}

          {eyebrow && (
            <header className="bg-linear-0 from-[#0E0E0E] to-[#1C1B1B] max-w-[85%] w-[500px] rounded-full mx-auto border border-[var(--primary)]/30 z-50">
              <div className="cf-container">
                <h3 className="text-center uppercase text-white/80 tracking-widest text-[12px] py-3 leading-[130%]">
                  <span>{eyebrow}</span>
                </h3>
              </div>
            </header>
          )}

          <section className="mt-6 pb-[60px] md:pb-[100px] border-b border-[var(--primary)] rounded-b-[45px] md:rounded-b-[60px] relative overflow-clip">
            <div className="cf-container">
              <h1 className="text-center text-[22px] md:text-[38px] font-bold uppercase leading-[140%] md:px-4">
                <span>{headline}</span>
              </h1>
              {description && (
                <p className="text-white/80 text-center mt-2 max-w-[750px] mx-auto">
                  {description}
                </p>
              )}

              <section className="relative">
                <div className="bg-[#131313] p-1 pt-0 border border-[var(--primary)] overflow-clip rounded-[12px] md:rounded-[16px] mt-6 max-w-[750px] mx-auto">
                  <div className="p-2 text-center text-[12px] uppercase text-white tracking-widest bg-[#131313]">
                    <span>Paso 1 de 2:</span> Mirá este video completo
                  </div>
                  <div className="bg-[#131313] aspect-video rounded-[8px] md:rounded-[12px] overflow-clip">
                    {vslEmbedUrl ? (
                      <iframe
                        className="w-full aspect-video"
                        src={vslEmbedUrl}
                        allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture"
                      ></iframe>
                    ) : (
                      <div className="w-full aspect-video flex items-center justify-center text-white/40 text-sm">
                        Cargá la URL del VSL desde el panel admin
                      </div>
                    )}
                  </div>
                </div>
              </section>

              <p className="mt-6 text-center text-[14px] mx-auto max-w-[420px]">
                <strong className="uppercase tracking-widest">Paso 2 de 2:</strong>{" "}
                <span className="text-white/80">
                  Agenda una llamada para asegurar tu lugar y empezar tu cambio físico.
                </span>
              </p>

              <div className="mt-6">
                <button
                  className="cf-btn disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={!isUnlocked}
                  onClick={() => {
                    if (!isUnlocked) return;
                    setIsFormOpened(true);
                  }}
                >
                  {heroCta}
                </button>
                <div className="h-[1px] relative overflow-clip max-w-[212px] mx-auto mt-4">
                  <div className="bg-radial from-white to-black/0 size-[200px]"></div>
                </div>
                <p className="text-center mt-4 leading-[90%] text-white/40 mx-auto max-w-[380px] text-[14px] flex items-center justify-center gap-2">
                  {isUnlocked ? heroGuarantee : "⚠️ El botón se habilitará luego de ver el video."}
                </p>
              </div>
            </div>

            <div className="bg-[var(--primary)]/80 size-[600px] rounded-full left-[-400px] absolute -z-50 blur-[200px] -bottom-[300px]"></div>
            <div className="bg-[var(--primary)]/80 size-[600px] rounded-full right-[-400px] absolute -z-50 blur-[200px] -bottom-[300px]"></div>
          </section>

          {VIDEO_TESTIMONIALS.length > 0 && (
            <section className="w-full bg-[#000] relative pt-[80px] md:pt-[120px] pb-[20px] md:pb-[40px]">
              <div className="cf-container relative">
                <div className="mx-auto w-full max-w-[960px]">
                  {testimonialsHeadline && (
                    <h2 className="text-[32px] md:text-[50px] max-w-[760px] mx-auto text-center font-bold text-white leading-[130%]">
                      {testimonialsHeadline}
                    </h2>
                  )}

                  <div className="mt-12 md:mt-16 space-y-6">
                    {VIDEO_TESTIMONIALS.map((t) => (
                      <div
                        key={t._id}
                        className="rounded-[18px] bg-linear-150 from-[var(--primary)]/20 via-[var(--primary)] to-[var(--primary)]/20 p-1 overflow-clip"
                      >
                        <div className="rounded-[14px] bg-[#0c0c0c] p-5 md:p-8 flex flex-col md:flex-row items-center gap-5 md:gap-8">
                          <div className="w-full md:w-[400px] md:shrink-0 rounded-[12px] overflow-clip bg-black">
                            <iframe
                              className="w-full aspect-video"
                              src={t.videoUrl}
                              title={t.titulo || "Testimonio"}
                              allow="autoplay; fullscreen"
                              allowFullScreen
                            ></iframe>
                          </div>
                          <div className="flex flex-col text-center md:text-left">
                            {t.titulo && (
                              <h3 className="text-[20px] md:text-[24px] font-bold text-white leading-[1.2]">
                                “{t.titulo}”
                              </h3>
                            )}
                            {t.story && (
                              <p className="text-white/60 mt-3 leading-[1.7] text-[15px]">
                                {t.story}
                              </p>
                            )}
                            {(t.nombre || t.dato) && (
                              <div className="mt-5 pt-4 border-t border-white/10">
                                {t.nombre && <p className="font-semibold text-white text-[15px]">{t.nombre}</p>}
                                {t.dato && <p className="text-white/50 mt-1 text-[13px]">{t.dato}</p>}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {TESTIMONIALS.length > 0 && (
            <section className="w-full bg-[#000] relative pt-[80px] md:pt-[160px] pb-[60px] md:pb-[90px]">
              <div className="h-[2px] top-0 absolute overflow-clip w-full z-50 hidden md:block">
                <div className="size-[400px] blur-[200px] left-[calc(50%-200px)] -top-[200px] absolute bg-[var(--primary)]"></div>
              </div>

              <img src="/images/img_background_testimonials.webp" className="absolute md:top-0 top-[140px] w-full object-contain" alt="Fit Funnels" />

              <div className="cf-container relative">
                <div className="mx-auto w-full max-w-[1200px] text-center">
                  {resultsHeadline && (
                    <h2 className="text-[32px] md:text-[50px] max-w-[760px] mx-auto font-bold text-white leading-[130%]">
                      {resultsHeadline}
                    </h2>
                  )}
                  {resultsSubheading && (
                    <p className="mt-4 text-white/80 text-[18px] max-w-[420px] mx-auto">
                      {resultsSubheading}
                    </p>
                  )}

                  <div className="grid md:grid-cols-3 mt-[140px] md:mt-[192px] gap-4">
                    {TESTIMONIALS.map((testimonial, i) => (
                      <div
                        key={`${testimonial.img}-${i}`}
                        className="rounded-[14px] w-full h-[350px] flex flex-col bg-linear-150 from-[var(--primary)]/20 via-[var(--primary)] to-[var(--primary)]/20 p-1 overflow-clip"
                      >
                        <p className="text-center py-2 tracking-wider text-[#f5f5f5]">
                          {testimonial.weight}
                        </p>

                        {testimonial.hasPair ? (
                          <div className="relative flex-1 overflow-clip rounded-[10px] grid grid-cols-2 gap-[2px]">
                            <div className="relative">
                              <img
                                className="w-full h-full object-cover"
                                src={testimonial.before}
                                alt={`${altImgGeneric} antes ${i + 1}`}
                              />
                              <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider bg-black/70 text-white px-2 py-0.5 rounded">
                                Antes
                              </span>
                            </div>
                            <div className="relative">
                              <img
                                className="w-full h-full object-cover"
                                src={testimonial.after}
                                alt={`${altImgGeneric} después ${i + 1}`}
                              />
                              <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider bg-[var(--primary)] text-white px-2 py-0.5 rounded">
                                Después
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="relative flex-1 overflow-clip rounded-[10px]">
                            <div className="absolute inset-0 rounded-[10px] bg-gradient-to-t from-black/90 from-5% to-transparent to-65%" />
                            <img
                              className="w-full h-full object-cover rounded-[10px]"
                              src={testimonial.single ?? testimonial.img}
                              alt={`${altImgGeneric} cambio ${i + 1}`}
                            />
                          </div>
                        )}
                      </div>
                    ))}

                    <div className="rounded-[14px] w-full bg-linear-150 from-[var(--primary)]/20 via-[var(--primary)] to-[var(--primary)]/20 p-1 overflow-clip flex flex-col h-[350px]">
                      {resultsOverlayLabel && (
                        <p className="text-center py-2 tracking-wider text-[#f5f5f5]">
                          {resultsOverlayLabel}
                        </p>
                      )}
                      {resultsCalloutText && (
                        <div className="relative flex-1 overflow-clip rounded-[10px] p-4 flex items-center justify-center">
                          {resultsCalloutText}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 md:mt-12">
                    <button
                      className="cf-btn disabled:opacity-60 disabled:cursor-not-allowed"
                      disabled={!isUnlocked}
                      onClick={() => {
                        if (!isUnlocked) return;
                        setIsFormOpened(true);
                      }}
                    >
                      {testimonialsCta}
                    </button>
                    <div className="h-[1px] relative overflow-clip max-w-[212px] mx-auto mt-4">
                      <div className="bg-radial from-white to-black/0 size-[200px]"></div>
                    </div>
                    <p className="text-center my-4 text-white/40 mx-auto max-w-[350px] text-[14px]">
                      {isUnlocked ? testimonialsCtaSubtext : "⚠️ El botón se habilitará luego de ver el video."}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          <p className="pb-6 pt-8 text-[14px] text-center px-4 text-white/60">
            {footerCopyrightTpl ? footerCopyrightTpl.replace("{year}", String(new Date().getFullYear())) : footerBrand}
            {footerMetaDisclaimer && (
              <>
                <br />
                <span className="mt-2 block max-w-[500px] mx-auto text-[12px] text-white/40">
                  {footerMetaDisclaimer}
                </span>
              </>
            )}
          </p>
        </div>
      )}
    </>
  );
}
