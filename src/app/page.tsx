"use client";

import { useEffect, useRef, useState } from "react";
import CalificationFormDirect from "./components/CalificationFormDirect";

export default function Home() {
  const [isFormOpened, setIsFormOpened] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsUnlocked(true);
    }, 0 * 60 * 1000);

    return () => clearTimeout(timer);
  }, []);

  const variantRef = useRef<"A" | "B">(Math.random() < 0.5 ? "A" : "B");
  const variant = variantRef.current;
  console.log(variant);

  const ctaText = "¡AGENDAR MI SESIÓN DE DIAGNÓSTICO!";
  const headlineText =
    variant === "A"
      ? "Bajá entre 6 y 15 kg de grasa corporal, recupera tu energía y tonificá en 90 días con mi Método M90"
      : "Bajá entre 8 y 12 kg de grasa, recupera tu energía y tonificá en 90 días con mi método M90";

  const testimonials = [
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

  const altImgGeneric = "Manu Nuñez - Fit";

  return (
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

      {isFormOpened && <CalificationFormDirect variant={variant} />}

      <header className="bg-linear-0 from-[#0E0E0E] to-[#1C1B1B] max-w-[85%] w-[500px] rounded-full mx-auto border border-[var(--primary)]/30 z-50">
        <div className="cf-container">
          <h3 className="text-center uppercase text-white/80 tracking-widest text-[12px] py-3 leading-[130%]">
            <span>Exclusivo para profesionales mayores de 35</span>
          </h3>
        </div>
      </header>

      <section className="mt-6 pb-[60px] md:pb-[100px] border-b border-[var(--primary)] rounded-b-[45px] md:rounded-b-[60px] relative overflow-clip">
        <div className="cf-container">
          <h1 className="text-center text-[22px] md:text-[38px] font-bold uppercase leading-[140%] md:px-4">
            <span>{headlineText}</span>
          </h1>
          <p className="text-white/80 text-center mt-2 max-w-[750px] mx-auto">
            Sin dietas extremas ni rutinas imposibles. No entrenás solo: trabajamos 1 a 1 con vos durante todo el proceso.
          </p>

          <section className="relative">
            <div className="bg-[#131313] p-1 pt-0 border border-[var(--primary)] overflow-clip rounded-[12px] md:rounded-[16px] mt-6 max-w-[750px] mx-auto">
              <div className="p-2 text-center text-[12px] uppercase text-white tracking-widest bg-[#131313]">
                <span>Paso 1 de 2:</span> Mirá este video completo
              </div>
              <div className="bg-[#131313] aspect-video rounded-[8px] md:rounded-[12px] overflow-clip">
                <iframe
                  className="w-full aspect-video"
                  id="panda-069e112f-6e84-4b51-819b-379c77bc03b5"
                  src="https://player-vz-5c2adb98-6a4.tv.pandavideo.com/embed/?v=069e112f-6e84-4b51-819b-379c77bc03b5"
                  allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture"
                ></iframe>
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
              {ctaText}
            </button>
            <div className="h-[1px] relative overflow-clip max-w-[212px] mx-auto mt-4">
              <div className="bg-radial from-white to-black/0 size-[200px]"></div>
            </div>
            <p className="text-center mt-4 leading-[90%] text-white/40 mx-auto max-w-[380px] text-[14px] flex items-center justify-center gap-2">
              {isUnlocked
                ? "+50 alumnos activos"
                : "⚠️ El botón se habilitará luego de ver el video."}
            </p>
          </div>
        </div>

        <div className="bg-[var(--primary)]/80 size-[600px] rounded-full left-[-400px] absolute -z-50 blur-[200px] -bottom-[300px]"></div>
        <div className="bg-[var(--primary)]/80 size-[600px] rounded-full right-[-400px] absolute -z-50 blur-[200px] -bottom-[300px]"></div>
      </section>

      <section className="w-full bg-[#000] relative pt-[80px] md:pt-[160px] pb-[60px] md:pb-[90px]">
        <div className="h-[2px] top-0 absolute overflow-clip w-full z-50 hidden md:block">
          <div className="size-[400px] blur-[200px] left-[calc(50%-200px)] -top-[200px] absolute bg-[var(--primary)]"></div>
        </div>

        <img src="/images/img_background_testimonials.webp" className="absolute md:top-0 top-[140px] w-full object-contain" alt="Fit Funnels" />
        
        <div className="cf-container relative">
          <div className="mx-auto w-full max-w-[1200px] text-center">
            <h2 className="text-[32px] md:text-[50px] max-w-[760px] mx-auto font-bold text-white leading-[130%]">
              Estos resultados podés obtener si agendas hoy
            </h2>
            <p className="mt-4 text-white/80 text-[18px] max-w-[420px] mx-auto">
              Si ellos pudieron, vos también podés.
            </p>

            <div className="grid md:grid-cols-3 mt-[140px] md:mt-[192px] gap-4">
              {testimonials.map((testimonial, i) => (
                <div
                  key={`${testimonial.img}-${i}`}
                  className="rounded-[14px] w-full h-[350px] flex flex-col bg-linear-150 from-[var(--primary)]/20 via-[var(--primary)] to-[var(--primary)]/20 p-1 overflow-clip"
                >
                  <p className="text-center py-2 tracking-wider text-[#f5f5f5]">
                    {testimonial.weight}
                  </p>

                  <div className="relative flex-1 overflow-clip rounded-[10px]">
                    <div className="absolute inset-0 rounded-[10px] bg-gradient-to-t from-black/90 from-5% to-transparent to-65%" />
                    <img
                      className="w-full h-full object-cover rounded-[10px]"
                      src={testimonial.img}
                      alt={`${altImgGeneric} cambio ${i + 1}`}
                    />
                  </div>
                </div>
              ))}

              <div className="rounded-[14px] w-full bg-linear-150 from-[var(--primary)]/20 via-[var(--primary)] to-[var(--primary)]/20 p-1 overflow-clip flex flex-col h-[350px]">
                <p className="text-center py-2 tracking-wider text-[#f5f5f5]">
                  ESTE LUGAR ES PARA VOS
                </p>
                <div className="relative flex-1 overflow-clip rounded-[10px] p-4 flex items-center justify-center">
                  Agenda tu sesión de diagnóstico y unite a los +50 casos de éxito con mi método M90.
                </div>
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
                {ctaText}
              </button>
              <div className="h-[1px] relative overflow-clip max-w-[212px] mx-auto mt-4">
                <div className="bg-radial from-white to-black/0 size-[200px]"></div>
              </div>
              <p className="text-center my-4 text-white/40 mx-auto max-w-[350px] text-[14px]">
                {isUnlocked
                  ? "Solo 8 cupos nuevos por mes"
                  : "⚠️ El botón se habilitará luego de ver el video."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <p className="pb-6 pt-8 text-[14px] text-center px-4 text-white/60">
        © Manu Nuñez 2025. Todos los derechos reservados.
        <br />
        <span className="mt-2 block max-w-[500px] mx-auto text-[12px] text-white/40">
          Este sitio no forma parte ni está avalado por Meta (Facebook o Instagram).
          Facebook e Instagram son marcas registradas de Meta Platforms, Inc.
        </span>
      </p>
    </div>
  );
}
