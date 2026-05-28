"use client";

import { useEffect, useMemo, useState } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

type FAQItem = { _id: string; question: string; answer: string };
type GalleryItem = { _id: string; weight: string; image: string };

type Props = {
  title: string;
  subtitle: string;
  whatsappCtaText: string;
  whatsappPrefilledMessage: string;
  videoEmbedUrl?: string;
  methodVideoEmbedUrl?: string;
  methodVideoHeading?: string;
  loomEmbedUrl?: string;
  loomSectionHeading?: string;
  whatsappNumber: string;
  faqs?: FAQItem[];
  urgentBanner?: string;
  checklistLabel?: string;
  check1?: string;
  check2?: string;
  check3?: string;
  cancellationWarning?: string;
  faqHeading?: string;
  scarcityMessage?: string;
  galleryItems?: GalleryItem[];
};

export default function ThankyouClient({
  title,
  subtitle,
  whatsappCtaText,
  whatsappPrefilledMessage,
  videoEmbedUrl,
  methodVideoEmbedUrl,
  methodVideoHeading = "",
  loomEmbedUrl,
  loomSectionHeading,
  whatsappNumber,
  faqs = [],
  urgentBanner = "",
  checklistLabel = "",
  check1 = "",
  check2 = "",
  check3 = "",
  cancellationWarning = "",
  faqHeading = "",
  scarcityMessage = "",
  galleryItems = [],
}: Props) {
  const [name, setName] = useState<string>("");
  const [startAt, setStartAt] = useState<string>("");
  const [agreeQuietPlace, setAgreeQuietPlace] = useState(false);
  const [agreeOnTime, setAgreeOnTime] = useState(false);
  const [agreeNoReschedule, setAgreeNoReschedule] = useState(false);

  const fireFbq = (eventName: string, eventId: string, payload: Record<string, unknown> = {}, onSuccess?: () => void) => {
    let attempts = 0;
    const tryFire = () => {
      attempts += 1;
      const fbq = (window as any)?.fbq;
      if (typeof fbq === "function") {
        try {
          fbq("track", eventName, payload, { eventID: eventId });
          onSuccess?.();
        } catch {}
        return;
      }
      if (attempts < 10) setTimeout(tryFire, 200);
    };
    tryFire();
  };

  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search);
      const n = q.get("name") || localStorage.getItem("name") || "";
      const s = q.get("startAt") || localStorage.getItem("meeting_startAt") || "";
      setName(n ?? "");
      setStartAt(s ?? "");
    } catch {}
  }, []);

  useEffect(() => {
    const isQualified = localStorage.getItem("isQualified");
    const scheduleFired = localStorage.getItem("schedule_fired");
    if (isQualified === "true" && scheduleFired !== "true") {
      const eventId = localStorage.getItem("schedule_event_id");
      if (eventId) {
        fireFbq("Schedule", eventId, {}, () => {
          localStorage.setItem("schedule_fired", "true");
          localStorage.removeItem("schedule_event_id");
          localStorage.removeItem("isQualified");
        });
      }
    }
  }, []);

  const countdown = useMemo(() => {
    if (!startAt) return null;
    const target = new Date(startAt).getTime();
    const now = Date.now();
    const diff = target - now;
    if (diff <= 0) return "¡Es ahora!";
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    return `${d}d ${h}h ${m}m`;
  }, [startAt]);

  const waNumber = whatsappNumber || "5492216720769";
  const confirmMsg = encodeURIComponent(
    `${whatsappPrefilledMessage} ${name ? `Soy ${name}.` : ""} ${startAt ? `Mi cita es ${new Date(startAt).toLocaleString()}.` : ""}`.trim()
  );
  const waConfirmHref = `https://wa.me/${waNumber}?text=${confirmMsg}`;
  const trackConfirm = () => {};

  const confirmEnabled = agreeQuietPlace && agreeOnTime && agreeNoReschedule;

  return (
    <div className="bg-white">
      <div className="max-w-[760px] mx-auto px-4 py-[36px]">
        {urgentBanner && (
          <p className="mb-3 bg-amber-200 flex items-center gap-2 justify-center p-2 rounded-md text-[16px] text-black">
            <svg className="fill-amber-500 size-[22px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M320 64C334.7 64 348.2 72.1 355.2 85L571.2 485C577.9 497.4 577.6 512.4 570.4 524.5C563.2 536.6 550.1 544 536 544L104 544C89.9 544 76.9 536.6 69.6 524.5C62.3 512.4 62.1 497.4 68.8 485L284.8 85C291.8 72.1 305.3 64 320 64zM320 232C306.7 232 296 242.7 296 256L296 368C296 381.3 306.7 392 320 392C333.3 392 344 381.3 344 368L344 256C344 242.7 333.3 232 320 232zM346.7 448C347.3 438.1 342.4 428.7 333.9 423.5C325.4 418.4 314.7 418.4 306.2 423.5C297.7 428.7 292.8 438.1 293.4 448C292.8 457.9 297.7 467.3 306.2 472.5C314.7 477.6 325.4 477.6 333.9 472.5C342.4 467.3 347.3 457.9 346.7 448z" /></svg>
            <span>{urgentBanner}</span>
          </p>
        )}

        {title && <h1 className="text-center text-black text-[28px] font-bold mb-4">{title}</h1>}
        {subtitle && <p className="text-center text-black/70 mb-4">{subtitle}</p>}

        {videoEmbedUrl && (
          <iframe className="w-full aspect-video my-4"
            src={videoEmbedUrl}
            allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture"
          />
        )}

        {startAt && (
          <p className="text-[16px] text-black/80 mb-4">
            Tu reunión está programada para: <strong>{new Date(startAt).toLocaleString()}</strong>
            {countdown && <span className="ml-2 px-2 py-1 bg-black text-white rounded">Comienza en {countdown}</span>}
          </p>
        )}

        {(checklistLabel || check1 || check2 || check3) && (
          <div className="rounded-xl border border-[#111]/20 p-4 bg-white mb-4">
            {checklistLabel && (
              <p className="font-semibold text-[18px] mb-2 text-black">{checklistLabel}</p>
            )}
            {check1 && (
              <label className="flex items-start gap-3 text-[16px] text-black mb-2">
                <input type="checkbox" className="mt-1" checked={agreeQuietPlace} onChange={(e) => setAgreeQuietPlace(e.target.checked)} />
                <span>{check1}</span>
              </label>
            )}
            {check2 && (
              <label className="flex items-start gap-3 text-[16px] text-black mb-2">
                <input type="checkbox" className="mt-1" checked={agreeOnTime} onChange={(e) => setAgreeOnTime(e.target.checked)} />
                <span>{check2}</span>
              </label>
            )}
            {check3 && (
              <label className="flex items-start gap-3 text-[16px] text-black">
                <input type="checkbox" className="mt-1" checked={agreeNoReschedule} onChange={(e) => setAgreeNoReschedule(e.target.checked)} />
                <span>{check3}</span>
              </label>
            )}
          </div>
        )}

        <a
          className={`py-3 block text-center mx-auto md:w-fit px-8 font-bold rounded-lg transition ${confirmEnabled ? "bg-green-600 text-white hover:opacity-90" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
          target="_blank"
          onClick={confirmEnabled ? trackConfirm : undefined}
          href={confirmEnabled ? waConfirmHref : undefined}
          aria-disabled={!confirmEnabled}
        >
          {whatsappCtaText}
        </a>
        {cancellationWarning && (
          <p className="text-red-500 text-[14px] text-center mt-2">{cancellationWarning}</p>
        )}

        {methodVideoEmbedUrl && (
          <>
            {methodVideoHeading && (
              <h3 className="text-center text-black text-[24px] leading-[115%] font-bold mb-6 mt-10">
                {methodVideoHeading}
              </h3>
            )}
            <iframe
              className="w-full aspect-video"
              src={methodVideoEmbedUrl}
              allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture"
            />
          </>
        )}

        {loomEmbedUrl && (
          <>
            {loomSectionHeading && (
              <h3 className="text-center text-black text-[24px] leading-[115%] font-bold mb-6 mt-10">
                {loomSectionHeading}
              </h3>
            )}
            <iframe
              className="w-full aspect-video rounded-lg"
              src={loomEmbedUrl}
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          </>
        )}

        {faqs.length > 0 && (
          <>
            <h3 className="text-center text-black text-[24px] leading-[115%] font-bold mb-6 mt-10">
              {faqHeading || "Preguntas frecuentes"}
            </h3>
            <Accordion type="single" collapsible className="w-full text-black">
              {faqs.map((f) => (
                <AccordionItem key={f._id} value={f._id}>
                  <AccordionTrigger className="text-[18px] font-bold leading-[120%]">
                    {f.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-[16px]">
                    {f.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </>
        )}

        {galleryItems.length > 0 && (
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            {galleryItems.map((g) => (
              <div key={g._id}>
                <p className="text-center py-2 bg-[#0051ff] text-white font-semibold">{g.weight}</p>
                <img className="w-full h-[260px] object-cover" src={g.image} alt={g.weight || "Cambio"} />
              </div>
            ))}
          </div>
        )}

        {(checklistLabel || check1 || check2 || check3) && (
          <div className="rounded-xl border border-[#111]/20 p-4 bg-white mt-8">
            {checklistLabel && (
              <p className="font-semibold text-[18px] mb-2 text-black">{checklistLabel}</p>
            )}
            {check1 && (
              <label className="flex items-start gap-3 text-[16px] text-black mb-2">
                <input type="checkbox" className="mt-1" checked={agreeQuietPlace} onChange={(e) => setAgreeQuietPlace(e.target.checked)} />
                <span>{check1}</span>
              </label>
            )}
            {check2 && (
              <label className="flex items-start gap-3 text-[16px] text-black mb-2">
                <input type="checkbox" className="mt-1" checked={agreeOnTime} onChange={(e) => setAgreeOnTime(e.target.checked)} />
                <span>{check2}</span>
              </label>
            )}
            {check3 && (
              <label className="flex items-start gap-3 text-[16px] text-black">
                <input type="checkbox" className="mt-1" checked={agreeNoReschedule} onChange={(e) => setAgreeNoReschedule(e.target.checked)} />
                <span>{check3}</span>
              </label>
            )}
          </div>
        )}

        <a
          className={`py-3 block text-center mx-auto md:w-fit mt-4 px-8 font-bold rounded-lg transition ${confirmEnabled ? "bg-green-600 text-white hover:opacity-90" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
          target="_blank"
          onClick={confirmEnabled ? trackConfirm : undefined}
          href={confirmEnabled ? waConfirmHref : undefined}
          aria-disabled={!confirmEnabled}
        >
          {whatsappCtaText}
        </a>

        {scarcityMessage && (
          <p className="text-center text-[14px] text-red-500 mt-2">{scarcityMessage}</p>
        )}
      </div>
    </div>
  );
}
