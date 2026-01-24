"use client";
import Script from "next/script";
import { useRef, useState, useEffect } from "react";
import CalificationFormDirect from "./components/CalificationFormDirect";

export default function Home() {
  const [isFormOpened, setIsFormOpened] = useState(false);

  // 🔒 Nuevo: control de bloqueo por 5 minutos
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsUnlocked(true);
    }, 0 * 60 * 1000); // 4 minutos

    return () => clearTimeout(timer);
  }, []);

  const variantRef = useRef<"A" | "B">(Math.random() < 0.5 ? "A" : "B");
  const variant = variantRef.current;
  console.log(variant);

  const CTA_TEXT = "¡AGENDAR MI SESIÓN DE DIAGNÓSTICO!";

  const VIDEO_TESTIMONIALS = [
    {
      video:
        "url",
      titulo: "titulo",
      story:
        "Backstory",
      nombre: "Nombre",
      dato: "Provincia, Pais",
    },
  ];

  const TESTIMONIALS = [
    {
      weight: "-6kg en 3 meses",
      img: "/images/testimonios/testimonio-1.png",
    },
    {
      weight: "-10kg en 3 meses",
      img: "/images/testimonios/testimonio-2.png",
    },
    {
      weight: "-8kg en 3 meses",
      img: "/images/testimonios/testimonio-3.png",
    },
    {
      weight: "-8kg en 3 meses",
      img: "/images/testimonios/testimonio-4.png",
    },
  ];

  const ALT_IMG_GENERIC = "Manu Nuñez - Fit"
  return (
    <div>
      {isFormOpened && <CalificationFormDirect variant={variant} />}
      <header className="border border-[#0051ff] bg-[#0051ff]/20 max-w-[85%] w-[400px] rounded-full mt-8 md:mt-12 mx-auto">
        <div className="cf-container">
          <h3 className="text-center text-[#f5f5f5] text-[14px] py-3 font-bold leading-[115%]">
            <span>
              Exclusivo para profesionales mayores de 35
            </span>
          </h3>
        </div>
      </header>

      {/* Sección VSL (siempre visible) */}
      <section className="mt-6 md:mt-8 pb-[60px] md:pb-[80px]">
        <div className="cf-container">
          <h1 className="text-center text-[20px] md:text-[32px] font-bold leading-[120%]">
            <span>
              Bajá entre <span>6 y 15 kg de grasa corporal, recupera tu energía y tonificá en 90 días</span> con mi <span>Método M90</span> - sin dietas extremas ni rutinas imposibles
            </span>
          </h1>
          <section className="relative">
            <div className="bg-[#0051ff] border-4 overflow-clip rounded-[12px] md:rounded-[16px] border-[#0051ff] mt-6 max-w-[750px] mx-auto">
              <div className="p-1 md:p-2 text-center text-[14px] text-white font-bold bg-[#0051ff]">
                <span>PASO 1 de 2:</span> MIRÁ EL VIDEO COMPLETO
              </div>
              <div className="bg-[#0051ff] aspect-video rounded-[8px] md:rounded-[12px] overflow-clip">
                <iframe
                  className="w-full aspect-video"
                  id="panda-069e112f-6e84-4b51-819b-379c77bc03b5"
                  src="https://player-vz-5c2adb98-6a4.tv.pandavideo.com/embed/?v=069e112f-6e84-4b51-819b-379c77bc03b5"
                  allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture"
                ></iframe>
              </div>
            </div>
          </section>
          <p className="mt-4 text-center text-[16px] max-w-[700px] mx-auto">
            <strong>PASO 2 de 2:</strong> Agenda una Llamada para Asegurar tu
            Lugar y tu Cambio Fisico.
          </p>

          {/* Botón bloqueado 5 minutos */}
          <div className="mt-6">
            <button
              className="cf-btn disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={!isUnlocked}
              onClick={() => {
                if (!isUnlocked) return;
                setIsFormOpened(true);
              }}
            >
              {CTA_TEXT}
            </button>
            <p className="text-center mt-4 text-white/60 italic mx-auto max-w-[350px] text-[14px]">
              {isUnlocked
                ? "Este programa no es para todos. Solo trabajamos con 8 alumnos por mes. Si tu objetivo es lograr un resultado real, aplicá arriba."
                : ""}
            </p>
          </div>
        </div>
      </section>

      {/* 🔒 TODO LO DE ABAJO SOLO SE VE DESPUÉS DE 5 MINUTOS
      {isUnlocked && (
        <>
          <section className="py-[40px] relative z-20">
            <div className="cf-container">
              <h2 className="text-[28px] font-bold text-white text-center uppercase max-w-[500px] leading-[120%] mx-auto">
                MATEO LO LOGRO ¿QUE ESTAS ESPERANDO?
              </h2>
              <div className="mt-8 max-w-[900px] mx-auto space-y-6">
                {VIDEO_TESTIMONIALS.map((testimonial) => {
                  return (
                    <div
                      key={testimonial.video}
                      className="p-2 rounded-[24px] relative overflow-clip"
                    >
                      <div className="bg-[#0051ff] size-[600px] md:size-[700px] top-0 md:-top-[100px] blur-[100px] opacity-[70%] rounded-full absolute left-[calc(50%-300px)] md:left-[calc(50%-350px)] -z-50"></div>
                      <div className="relative bg-[#00091e] z-50 p-8 md:p-[50px] rounded-[20px] flex md:flex-row flex-col gap-4 md:gap-8">
                        <div className="w-full md:min-w-[360px] aspect-video rounded-[10px] overflow-hidden">
                          <iframe
                            className="w-full h-full"
                            src={testimonial.video}
                            title={testimonial.titulo}
                            allow="autoplay; fullscreen"
                          ></iframe>
                        </div>
                        <div className="py-4 flex flex-col justify-between">
                          <div>
                            <h3 className="text-[24px] leading-[120%] font-bold">
                              {testimonial.titulo}
                            </h3>
                            <p className="text-white/80 mt-4">
                              {testimonial.story}
                            </p>
                          </div>
                          <div className="mt-4">
                            <p>{testimonial.nombre}</p>
                            <p className="text-white/80 mt-2 text-[14px]">
                              {testimonial.dato}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <button
                className="cf-btn mt-8"
                onClick={() => {
                  setIsFormOpened(true);
                }}
              >
                ¡AGENDAR MI SESIÓN DE DIAGNÓSTICO!
              </button>
              <p className="text-center mt-4 text-white/60 italic mx-auto max-w-[350px] text-[14px]">
                Cupos limitados - No te lo pierdas!
              </p>
            </div>
          </section>
        </>
      )} */}

      <section className="py-[60px] md:py-[80px] relative overflow-clip">
        <div className="cf-container">
          <h2 className="text-[28px] font-bold text-white text-center uppercase max-w-[600px] leading-[120%] mx-auto">
            ESTOS RESULTADOS PODES OBTENER SI AGENDAS HOY
          </h2>
          <p className="text-white/80 text-center mt-4 max-w-[400px] mx-auto">
            Si ellos pudieron, vos también podés. Solo necesitás un método
            pensado específicamente para vos.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {TESTIMONIALS.map((t, i) => (
              <div className="rounded-[14px] w-full md:w-[32%] bg-[#0051ff] p-1 overflow-hidden">
                <p className="text-center py-2 bg-[#0051ff] text-[#f5f5f5] font-semibold">
                  {t.weight}
                </p>
                <img
                  className="w-full rounded-[10px] h-[290px] max-h-full object-cover"
                  src={`${t.img}`}
                  alt={`${ALT_IMG_GENERIC} cambio ${i + 1}`}
                />
              </div>
            ))}
            <div className="h-full w-full md:w-[32%] min-h-[338px] overflow-clip relative border-4 border-[#0051ff] p-1 rounded-[14px]">
              <div className="absolute flex items-center justify-center w-full h-full bg-black/90">
                <p className="text-white text-center px-8 font-semibold">
                  +20 cambios como estos
                  <br />
                  (Mirá el video completo y agendá tu sesión de diagnóstico)
                </p>
              </div>
              <img className="w-full h-full object-cover min-h-[338px]" src="/images/testimonios/testimonio-1.png" alt={`${ALT_IMG_GENERIC}`} />
            </div>
          </div>
          {/* Botón bloqueado 5 minutos */}
          <div className="mt-8">
            <button
              className="cf-btn disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={!isUnlocked}
              onClick={() => {
                if (!isUnlocked) return;
                setIsFormOpened(true);
              }}
            >
              ¡AGENDAR MI SESIÓN DE DIAGNÓSTICO!
            </button>
            <p className="text-center mt-4 text-white/60 italic mx-auto max-w-[350px] text-[14px]">
              {isUnlocked
                ? "Cupos limitados - No te lo pierdas!"
                : ""}
            </p>
          </div>
        </div>
        <div className="bg-[#0051ff] size-[600px] md:size-[700px] blur-[100px] md:blur-[200px] opacity-[50%] rounded-full absolute left-[calc(50%-300px)] md:-left-[300px] -bottom-[300px] md:block hidden -z-50"></div>
        <div className="bg-[#0051ff] size-[600px] md:size-[700px] blur-[100px] md:blur-[200px] opacity-[50%] rounded-full absolute right-[calc(50%-300px)] md:-right-[300px] -bottom-[300px] md:block hidden -z-50"></div>
      </section>

      <p className="pb-6 pt-8 text-[14px] text-center px-4 text-white/60">
        © Manu Nuñez 2025. Todos los derechos reservados.
      </p>
    </div>
  );
}
