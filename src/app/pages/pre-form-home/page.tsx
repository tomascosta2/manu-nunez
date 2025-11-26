'use client'

import Image from "next/image";
import { useState } from "react";
import CalificationForm from "../../components/CalificationForm";

export default function Home() {

  const [isFormOpened, setIsFormOpened] = useState(false);

  const VIDEO_TESTIMONIALS = [
    {
      video: "https://fast.wistia.net/embed/iframe/sywml2ydcd?web_component=true&seo=true&videoFoam=false",
      titulo: "Bruno recuperó su físico",
      story: "Antes no tenía energía ni motivación. Hoy entrena 3 veces por semana y bajó más de 10 kg.",
      nombre: "Bruno Parra",
      dato: "26 años || Mendoza",
    },
    {
      video: "https://fast.wistia.net/embed/iframe/3o25spxhzg?web_component=true&seo=true&videoFoam=false",
      titulo: "Javi volvió a confiar en sí mismo",
      story: "Estaba estancado, había perdido toda confianza. Hoy tiene el cuerpo que siempre quiso.",
      nombre: "Javier Salaverry",
      dato: "54 años || Córdoba",
    },
    {
      video: "https://fast.wistia.net/embed/iframe/u7v57jc2ew?web_component=true&seo=true&videoFoam=false",
      titulo: "Tomi logró resultados sostenibles",
      story: "Después de años probando dietas, finalmente encontró algo que se adapta a su vida.",
      nombre: "Tomás Iglesias",
      dato: "24 años || Buenos Aires",
    },
  ];

  return (
    <div>
      {
        isFormOpened && (
          <CalificationForm />
        )
      }
      <header>
        <div className="cf-container">
          <h3
            className="text-center py-3 border-b border-b-white/30 font-semibold"
          >
            SOLO PARA HOMBRES +27 OCUPADOS CON SU TRABAJO Y FAMILIA
          </h3>
        </div>
      </header>
      <section className="pt-8 pb-[60px] md:pb-[80px]">
        <div className="cf-container">
          {/* <p className="mb-4 text-center max-w-[900px] mx-auto">
            Si ya intentaste de todo y nada te funcionó, es porque nadie diseñó un método que se adapte a tu vida real. Hasta ahora.
          </p> */}
          <h1 className="text-center text-[24px] md:text-[32px] font-bold leading-[120%]">
            BAJA ENTRE <span className="text-[#0051ff]">5 Y 15 KG DE GRASA CORPORAL EN 90 DÍAS</span> CON EL <span className="text-[#0051ff]">MÉTODO FIT90</span> - SIN DIETAS EXTREMAS NI RUTINAS IMPOSIBLES
          </h1>
          <p className="mt-4 text-center max-w-[900px] mx-auto">
            <strong className="underline">Paso 1:</strong> Hace clic en el video, llena el formulario y mirá el video completo.
            <br />
            <strong className="underline">Paso 2:</strong> Aplicalo, y transforma tu vida, como te ves y como te ven, para siempre.
          </p>
          <div
            className="border-4 rounded-[12px] md:rounded-[16px] border-[#0051ff] mt-8 max-w-[750px] mx-auto cursor-pointer"
            onClick={() => { setIsFormOpened(true) }}
          >
            <div className="p-2 text-center text-[#000] font-bold bg-[#0051ff]">
              CLIC PARA VER EL MÉTODO
            </div>
            <div
              className="overflow-clip aspect-video rounded-br-[8px] md:rounded-br-[12px] rounded-bl-[8px] md:rounded-bl-[12px]"
            >
              <img className="w-full h-full object-cover" src="/images/portada-clic-here-eli.webp" alt="Nano Ponce Fit" />
            </div>
          </div>
          <div className="mt-8">
            <button
              className="cf-btn"
              onClick={() => { setIsFormOpened(true) }}
            >
              QUIERO SABER COMO FUNCIONA
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
                  fill="#111111"></path>
              </svg>
            </button>
            <p className="text-center mt-4 text-white/80 mx-auto max-w-[350px] text-[14px]">
              PD: Más de 100 hombres ya lo vieron y están aplicando el método. Vos podés ser el próximo.
            </p>
          </div>
        </div>
      </section>

      {/* 
      <section className="py-[40px]">
        <div className="cf-container">
          <h2
            className="text-[28px] font-bold text-white text-center uppercase max-w-[500px] leading-[120%] mx-auto"
          >
            ELLOS YA LO LOGRARON ¿QUE ESTAS ESPERANDO?
          </h2>
          <div className="mt-8 max-w-[900px] mx-auto space-y-6">
            {
              VIDEO_TESTIMONIALS.map((testimonial) => {
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
                        <h3 className="text-[24px] font-bold">{testimonial.titulo}</h3>
                        <p className="text-white/80 mt-4">{testimonial.story}</p>
                      </div>
                      <div className="mt-4">
                        <p>{testimonial.nombre}</p>
                        <p className="text-white/80 mt-2 text-[14px]">{testimonial.dato}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            }
          </div>
          <a
            className="cf-btn mt-8"
            href="/pages/calendly"
          >
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
                fill="#111111"></path>
            </svg>
          </a>
          <p className="text-center mt-4 text-white/80 mx-auto max-w-[350px] text-[14px]">
             PD: Te garantizamos resultados con <span className="underline">solo 3 horas por semana</span> o trabajamos gratis con vos hasta lograrlo.
          </p>
        </div>
      </section> */}

      <section className="pb-[80px]">
        <div className="cf-container">
          <h2
            className="text-[24px] md:text-[28px] font-bold text-white text-center uppercase max-w-[600px] leading-[120%] mx-auto"
          >
            Si ellos pudieron, vos también podés. Solo necesitás un método pensado específicamente para vos
          </h2>

          <div className="grid md:grid-cols-5 gap-4 mt-8">
            <div>
              <p className="text-center py-2 bg-[#0051ff] text-black font-semibold">-8 KG en 3 Meses</p>
              <img src="/images/eli-cambio-1.jpg" alt="Nano Ponce Fit - Cambio 1" />
            </div>
            <div>
              <p className="text-center py-2 bg-[#0051ff] text-black font-semibold">-7 KG en 3 Meses</p>
              <img src="/images/eli-cambio-2.jpg" alt="Nano Ponce Fit - Cambio 2" />
            </div>
            <div>
              <p className="text-center py-2 bg-[#0051ff] text-black font-semibold">-5 KG en 1 Mes</p>
              <img src="/images/eli-cambio-3.jpg" alt="Nano Ponce Fit - Cambio 3" />
            </div>
            <div>
              <p className="text-center py-2 bg-[#0051ff] text-black font-semibold">-5 KG en 2 Meses</p>
              <img src="/images/eli-cambio-4.jpg" alt="Nano Ponce Fit - Cambio 4" />
            </div>
            <div>
              <p className="text-center py-2 bg-[#0051ff] text-black font-semibold">-5 KG en 2 Meses</p>
              <img src="/images/eli-cambio-5.jpg" alt="Nano Ponce Fit - Cambio 5" />
            </div>
          </div>
          <button
            className="cf-btn mt-8"
            onClick={() => { setIsFormOpened(true) }}
          >
            QUIERO SABER COMO FUNCIONA
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
                fill="#111111"></path>
            </svg>
          </button>
          <p className="text-center mt-4 text-white/80 mx-auto max-w-[350px] text-[14px]">
            PD: Más de 100 hombres ya lo vieron y están aplicando el método. Vos podés ser el próximo.
          </p>
        </div>
      </section>

      <section className="pb-[80px]">
        <div className="cf-container max-w-[800px] mx-auto">
          <h2 className="text-[24px] md:text-[28px] font-bold text-white leading-[120%]">
            No necesitás más fuerza de voluntad. Solo necesitás un sistema que funcione para vos.
          </h2>
          <p className="mt-6 text-white/80 text-[18px] md:text-[18px]">
            La mayoría de los hombres que hoy tienen el cuerpo que quieren no son distintos a vos.
            Simplemente dejaron de improvisar y empezaron a seguir un paso a paso diseñado para su realidad:
            poco tiempo, mucho estrés, y cero ganas de pasar hambre.
          </p>
          <p className="mt-4 text-white/80 text-[18px] md:text-[18px]">
            El Método FIT90 ya ayudó a decenas de hombres a transformar su físico y recuperar su confianza.
            Y ahora te toca a vos.
          </p>
          <p className="mt-4 text-white/90 font-semibold text-[18px]">
            Probalo sin riesgo: mira el video 100% gratis, y probalo por tu cuenta o contáctanos y te guiamos 1 a 1 por el proceso con resultados GARANTIZADOS por contrato.
          </p>
          <button
            className="cf-btn mt-8"
            onClick={() => setIsFormOpened(true)}
          >
            QUIERO EMPEZAR AHORA
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
                fill="#111111"></path>
            </svg>
          </button>
          <p className="text-center mt-4 text-white/80 mx-auto max-w-[350px] text-[14px]">
            PD: Más de 100 hombres ya lo vieron y están aplicando el método. Vos podés ser el próximo.
          </p>
        </div>
      </section>
    </div>
  );
}
