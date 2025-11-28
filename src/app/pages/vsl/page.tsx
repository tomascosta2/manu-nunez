import Script from "next/script";

export default function Home() {
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

  const VIDEO_TESTIMONIALS = [
    {
      video:
        "https://fast.wistia.net/embed/iframe/sywml2ydcd?web_component=true&seo=true&videoFoam=false",
      titulo: "Bruno recuperó su físico",
      story:
        "Antes no tenía energía ni motivación. Hoy entrena 3 veces por semana y bajó más de 10 kg.",
      nombre: "Bruno M.",
      dato: "26 años || Mendoza",
    },
    {
      video:
        "https://fast.wistia.net/embed/iframe/3o25spxhzg?web_component=true&seo=true&videoFoam=false",
      titulo: "Javi volvió a confiar en sí mismo",
      story:
        "Estaba estancado, había perdido toda confianza. Hoy tiene el cuerpo que siempre quiso.",
      nombre: "Javier P.",
      dato: "54 años || Córdoba",
    },
    {
      video:
        "https://fast.wistia.net/embed/iframe/u7v57jc2ew?web_component=true&seo=true&videoFoam=false",
      titulo: "Tomi logró resultados sostenibles",
      story:
        "Después de años probando dietas, finalmente encontró algo que se adapta a su vida.",
      nombre: "Tomás C.",
      dato: "24 años || Buenos Aires",
    },
  ];

  return (
    <div>
      <header>
        <div className="cf-container">
          <h3 className="text-center py-3 border-b border-b-white/30 font-semibold">
            SOLO PARA HOMBRES +27 OCUPADOS CON SU TRABAJO Y FAMILIA
          </h3>
        </div>
      </header>
      <section className="pt-8 pb-[60px] md:pb-[80px]">
        <div className="cf-container">
          <h1 className="text-center text-[24px] md:text-[32px] font-bold leading-[120%]">
            BAJA ENTRE{" "}
            <span className="text-[#0051ff]">
              5 Y 15 KG DE GRASA CORPORAL EN 90 DÍAS
            </span>{" "}
            CON EL <span className="text-[#0051ff]">MÉTODO FIT90</span> - SIN
            DIETAS EXTREMAS NI RUTINAS IMPOSIBLES
          </h1>
          <p className="mt-4 text-center max-w-[700px] mx-auto">
            Mirá el video completo, y aplicalo por tu cuenta o agenda una
            llamada para asegurar tu transformación.
          </p>
          <div className="border-4 overflow-clip rounded-[12px] md:rounded-[16px] border-[#0051ff] mt-8 max-w-[750px] mx-auto">
            <div className="p-2 text-center text-black font-bold bg-[#0051ff]">
              CLIC PARA ACTIVAR EL SONIDO
            </div>
            <div className="bg-gray-300 aspect-video rounded-br-[8px] md:rounded-br-[12px] rounded-bl-[8px] md:rounded-bl-[12px]">
              <iframe
                className="w-full aspect-video"
                id="panda-069e112f-6e84-4b51-819b-379c77bc03b5"
                src="https://player-vz-5c2adb98-6a4.tv.pandavideo.com/embed/?v=069e112f-6e84-4b51-819b-379c77bc03b5"
                allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture"
              ></iframe>
            </div>
          </div>
          <div className="mt-8">
            <a className="cf-btn" href="/pages/calendly">
              QUIERO MI ASESORIA 1 A 1
              <svg
                width="13"
                height="12"
                viewBox="0 0 13 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0"
              >
                <path
                  d="M6.41318 11.6364L5.09499 10.3296L8.55522 6.86932H0.447266V4.94887H8.55522L5.09499 1.49432L6.41318 0.181824L12.1404 5.9091L6.41318 11.6364Z"
                  fill="#FFFFFF"
                ></path>
              </svg>
            </a>
            <p className="text-center mt-4 text-white/80 mx-auto max-w-[350px] text-[14px]">
              PD: Te garantizamos resultados con{" "}
              <span className="underline">solo 3 horas por semana</span> o
              trabajamos gratis con vos hasta lograrlo.
            </p>
          </div>
        </div>
      </section>

      {/* 
      TESTIMONIOS
      <section className="py-[40px]">
        <div className="cf-container">
          <h2 className="text-[28px] font-bold text-white text-center uppercase max-w-[500px] leading-[120%] mx-auto">
            ELLOS YA LO LOGRARON ¿QUE ESTAS ESPERANDO?
          </h2>
          <div className="mt-8 max-w-[900px] mx-auto space-y-6">
            {VIDEO_TESTIMONIALS.map((testimonial) => {
              return (
                <div className="p-8 md:p-[50px] border rounded-[20px] border-white/20 flex md:flex-row flex-col gap-4 md:gap-8">
                  <div className="w-full md:w-[360px] aspect-video rounded-[10px] overflow-hidden">
                    <iframe
                      className="w-full h-full"
                      src={testimonial.video}
                      title={testimonial.titulo}
                      allow="autoplay; fullscreen"
                      frameBorder="0"
                      scrolling="no"
                    ></iframe>
                  </div>
                  <div className="py-4 flex flex-col justify-between">
                    <div>
                      <h3 className="text-[24px] font-bold">
                        {testimonial.titulo}
                      </h3>
                      <p className="text-white/80 mt-4">{testimonial.story}</p>
                    </div>
                    <div className="mt-4">
                      <p>{testimonial.nombre}</p>
                      <p className="text-white/80 mt-2 text-[14px]">
                        {testimonial.dato}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <a className="cf-btn mt-8" href="/pages/calendly">
            QUIERO MI ASESORIA 1 A 1
            <svg
              width="13"
              height="12"
              viewBox="0 0 13 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0"
            >
              <path
                d="M6.41318 11.6364L5.09499 10.3296L8.55522 6.86932H0.447266V4.94887H8.55522L5.09499 1.49432L6.41318 0.181824L12.1404 5.9091L6.41318 11.6364Z"
                fill="#FFFFFF"
              ></path>
            </svg>
          </a>
          <p className="text-center mt-4 text-white/80 mx-auto max-w-[350px] text-[14px]">
            PD: Te garantizamos resultados con{" "}
            <span className="underline">solo 3 horas por semana</span> o
            trabajamos gratis con vos hasta lograrlo.
          </p>
        </div>
      </section> */}

      <section className="py-[80px]">
        <div className="cf-container">
          <h2 className="text-[28px] font-bold text-white text-center uppercase max-w-[600px] leading-[120%] mx-auto">
            ESTOS RESULTADOS PODES OBTENER SI AGENDAS HOY
          </h2>
          <p className="text-white/80 text-center mt-4 max-w-[400px] mx-auto">
            Si ellos pudieron, vos también podés. Solo necesitás un método
            pensado específicamente para vos.
          </p>

          <div className="grid md:grid-cols-5 gap-4 mt-8">
            {TESTIMONIALS.map((t, i) => (
              <div key={i}>
                <p className="text-center py-2 bg-[#0051ff] text-white font-semibold">
                  {t.weight}
                </p>
                <img
                  className="w-full h-64 object-cover rounded"
                  src={`${t.img}`}
                  alt={`Manu Nuñez fit - Cambio ${i}`}
                />
              </div>
            ))}
          </div>
          <a className="cf-btn mt-8" href="/pages/calendly">
            QUIERO MI ASESORIA 1 A 1
            <svg
              width="13"
              height="12"
              viewBox="0 0 13 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0"
            >
              <path
                d="M6.41318 11.6364L5.09499 10.3296L8.55522 6.86932H0.447266V4.94887H8.55522L5.09499 1.49432L6.41318 0.181824L12.1404 5.9091L6.41318 11.6364Z"
                fill="#FFFFFF"
              ></path>
            </svg>
          </a>
          <p className="text-center mt-4 text-white/80 mx-auto max-w-[350px] text-[14px]">
            PD: Te garantizamos resultados con{" "}
            <span className="underline">solo 3 horas por semana</span> o
            trabajamos gratis con vos hasta lograrlo.
          </p>
        </div>
      </section>
    </div>
  );
}
