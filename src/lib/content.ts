import fs from "node:fs/promises";
import path from "node:path";
import { cookies } from "next/headers";
import { unstable_noStore as noStore } from "next/cache";
import { put, list } from "@vercel/blob";
import type { AB } from "./ab-cookie";

export const PREVIEW_COOKIE = "_admin_preview";

export { AB_COOKIE, pickVariant, isTestActive } from "./ab-cookie";
export type { AB, Variant } from "./ab-cookie";

// ── Tipos ─────────────────────────────────────────────────────
export type SiteConfig = {
  whatsappNumber?: string;
  calendlyUrl?: string;
  pixelId?: string;
  hotjarId?: string;
};

export type Hero = {
  eyebrow?: AB;
  headline?: AB;
  description?: AB;          // subtítulo debajo del headline
  vslEmbedUrl?: AB;
  pdText?: AB;
  ctaText?: AB;              // texto del botón principal
  guaranteeText?: AB;        // texto chico debajo del CTA
  socialProofVisible?: boolean;  // mostrar la barra (estrellas + texto + imagen)
  showStars?: boolean;
  socialProofImageUrl?: string;  // imagen única con avatares (en vez de 5 sueltos)
};

export type HomeSections = {
  testimonialsHeadline?: AB;
  testimonialsCta?: AB;
  testimonialsCtaSubtext?: AB;
  resultsHeadline?: AB;
  resultsSubheading?: AB;
  resultsOverlayLabel?: AB;  // "TU PRÓXIMO CAMBIO" en cada card
  resultsCalloutText?: AB;   // "¿Cuándo vas a ser vos el próximo?"
  resultsFinalCtaSubtext?: AB;
};

export type Footer = {
  brandLine?: AB;
  copyright?: AB;
  metaDisclaimer?: AB;
  privacyLabel?: AB;
  termsLabel?: AB;
};

export type NotQualifiedPage = {
  message?: AB;
};

export type ContactPage = {
  thankYouMessage?: AB;
  followInstagramText?: AB;
  instagramUrl?: string;
};

export type FormLabels = {
  nameLabel?: AB;
  namePlaceholder?: AB;
  emailLabel?: AB;
  emailPlaceholder?: AB;
  phoneLabel?: AB;
  countryPlaceholder?: AB;
  numberPlaceholder?: AB;
  phoneInvalidMessage?: AB;
  phoneInvalidHint?: AB;
  objectiveTip?: AB;
  backButton?: AB;
  nextButton?: AB;
  loadingButton?: AB;
  submitButton?: AB;
};

export type VideoTestimonial = {
  _id: string;
  videoUrl?: string;
  titulo?: string;
  story?: string;
  nombre?: string;
  dato?: string;
};

export type ResultGalleryItem = {
  _id: string;
  weight?: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  imageUrl?: string;          // legacy: solo se usa si no hay before/after
};

export type CalendlyPage = {
  title?: AB;
  subtitle?: AB;
  pdText?: AB;
  eyebrow?: AB;
  urgentHeadline?: AB;
};

export type FAQ = {
  _id: string;
  question?: AB;
  answer?: AB;
};

export type ThankyouPage = {
  title?: AB;
  subtitle?: AB;
  whatsappCtaText?: AB;
  whatsappPrefilledMessage?: AB;
  videoEmbedUrl?: AB;
  faqs?: FAQ[];
  urgentBanner?: AB;
  checklistLabel?: AB;
  check1?: AB;
  check2?: AB;
  check3?: AB;
  cancellationWarning?: AB;
  videoSectionHeading?: AB;
  faqHeading?: AB;
  scarcityMessage?: AB;
  loomEmbedUrl?: AB;
  loomSectionHeading?: AB;
  introVideoUrl?: AB;
};

export type SectionEyebrows = {
  testimonials?: AB;
  results?: AB;
};

export type FormOption = {
  _id: string;
  value: string;       // estable, usado en lógica de calificación
  label?: AB;          // editable
};

export type FormQuestion = {
  _id: string;
  type: "contact" | "single" | "text";
  id: string;          // estable, usado en lógica del form
  title?: AB;
  subtitle?: AB;
  placeholder?: string;
  required?: boolean;
  options?: FormOption[];
};

export type LegalPages = {
  privacy?: string;
  terms?: string;
};

export type Content = {
  siteConfig?: SiteConfig;
  hero?: Hero;
  sectionEyebrows?: SectionEyebrows;
  homeSections?: HomeSections;
  footer?: Footer;
  notQualifiedPage?: NotQualifiedPage;
  contactPage?: ContactPage;
  formLabels?: FormLabels;
  videoTestimonials?: VideoTestimonial[];
  resultGallery?: ResultGalleryItem[];
  calendlyPage?: CalendlyPage;
  thankyouPage?: ThankyouPage;
  formQuestions?: FormQuestion[];
  legalPages?: LegalPages;
  activeTestId?: string;
};

const DEFAULT_PRIVACY = `# Política de Privacidad

**Última actualización:** ${new Date().getFullYear()}

En Mathías Guevara — Método Impulso Profesional ("nosotros", "nuestro"), respetamos tu privacidad y nos comprometemos a proteger los datos personales que compartís con nosotros. Esta política describe qué información recolectamos, cómo la usamos y qué derechos tenés sobre ella.

## 1. Información que recolectamos

Cuando completás el formulario de aplicación o agendás una sesión recolectamos:
- Nombre y apellido
- Correo electrónico
- Número de teléfono / WhatsApp
- Respuestas al formulario de calificación (objetivos, ocupación, etc.)

También recolectamos automáticamente, mediante cookies y pixeles:
- IP, navegador y dispositivo
- Páginas visitadas y tiempo de navegación
- Parámetros de campañas (fbclid, utm_*, etc.)

## 2. Cómo usamos tu información

- Contactarte para coordinar la sesión de diagnóstico.
- Personalizar el seguimiento y el contenido que recibís.
- Medir y optimizar nuestras campañas publicitarias.
- Cumplir con obligaciones legales.

## 3. Compartición de datos

No vendemos tus datos. Compartimos información estrictamente necesaria con:
- Plataformas de comunicación (Calendly, WhatsApp).
- Proveedores de analítica (Meta, Hotjar).
- Servicios de email transaccional.

## 4. Cookies

Usamos cookies propias y de terceros para mejorar la experiencia, medir tráfico y optimizar campañas. Podés deshabilitarlas en la configuración de tu navegador.

## 5. Tus derechos

Tenés derecho a acceder, rectificar, eliminar y portar tus datos. Para ejercerlos, escribinos a través del WhatsApp de contacto.

## 6. Cambios en la política

Podemos actualizar esta política. Publicaremos cualquier cambio en esta misma página con la fecha de última actualización.

## 7. Contacto

Para cualquier consulta sobre privacidad, podés escribirnos por el WhatsApp del sitio.`;

const DEFAULT_TERMS = `# Términos y Condiciones

**Última actualización:** ${new Date().getFullYear()}

Al utilizar este sitio y/o aplicar al Método Impulso Profesional aceptás los siguientes términos.

## 1. Servicio

El Método Impulso Profesional es un servicio de coaching deportivo y nutricional 1-a-1, ofrecido de forma 100% online por Mathías Guevara. La duración estándar del programa es de 3 meses.

## 2. Aplicación y aceptación

Completar el formulario de aplicación NO garantiza tu admisión al programa. Cada caso se evalúa en la sesión de diagnóstico. Nos reservamos el derecho de no aceptar a quienes consideremos que no son perfil ideal del programa.

## 3. Inversión y formas de pago

El valor del programa se comunica durante la sesión de diagnóstico. Aceptamos pago en un único monto o plan de cuotas según lo acordado en la llamada.

## 4. Resultados

Los testimonios y resultados mostrados son reales pero no garantizan que vos vayas a obtener los mismos. Los resultados dependen de tu adherencia al plan, tu punto de partida y otros factores individuales.

Garantía de resultados: si seguís el plan al pie de la letra durante los 3 meses y no obtenés los resultados acordados, continuamos trabajando con vos sin costo adicional hasta lograrlos.

## 5. Cancelaciones y reembolsos

Una vez iniciado el programa no hay reembolsos. Si por motivos excepcionales no podés continuar, podemos pausar el programa hasta 30 días.

## 6. Conducta del alumno

Esperamos respeto, compromiso y honestidad. Nos reservamos el derecho de dar por finalizado el programa sin reembolso ante incumplimientos graves del código de conducta.

## 7. Propiedad intelectual

Todo el material entregado (planes, videos, PDFs) es de uso exclusivo personal. Está prohibida su reventa, redistribución o uso comercial.

## 8. Limitación de responsabilidad

Este programa NO reemplaza el consejo médico profesional. Antes de comenzar consultá con tu médico si tenés alguna condición de salud que pudiera contraindicar el ejercicio físico o cambios en la alimentación.

## 9. Modificaciones

Nos reservamos el derecho a modificar estos términos. Las actualizaciones se publicarán en esta misma página.

## 10. Jurisdicción

Estos términos se rigen por las leyes de Uruguay. Cualquier disputa se resolverá en los tribunales correspondientes a la jurisdicción del prestador.`;

const CONTENT_BLOB_PATH = "content/content.json";
const LOCAL_CONTENT_FILE = path.join(process.cwd(), "data", "content.json");
const DRAFT_BLOB_PATH = "content/draft.json";
const LOCAL_DRAFT_FILE = path.join(process.cwd(), "data", "content-draft.json");

export const DEFAULT_CONTENT: Content = {
  siteConfig: {
    whatsappNumber: "5492216720769",
    calendlyUrl: "https://calendly.com/sarlomanuel33/30min",
    pixelId: "",
    hotjarId: "",
  },
  hero: {
    eyebrow: { a: "Exclusivo para profesionales mayores de 35" },
    headline: {
      a: "Bajá entre 6 y 15 kg de grasa corporal y tonificá en 90 días sin dietas extremas ni rutinas imposibles con el Método M90",
    },
    vslEmbedUrl: { a: "https://player-vz-5c2adb98-6a4.tv.pandavideo.com/embed/?v=069e112f-6e84-4b51-819b-379c77bc03b5" },
    pdText: { a: "" },
    description: { a: "El método que usan hombres con trabajos sedentarios para transformar su cuerpo sin cambiar su estilo de vida." },
    ctaText: { a: "¡AGENDAR MI SESIÓN DE DIAGNÓSTICO!" },
    guaranteeText: { a: "+50 alumnos activos" },
    socialProofVisible: false,
    showStars: false,
    socialProofImageUrl: "",
  },
  sectionEyebrows: {
    testimonials: { a: "" },
    results: { a: "" },
  },
  homeSections: {
    testimonialsHeadline: { a: "Tasa de exito del 100% en la pérdida de grasa de mis alumnos." },
    testimonialsCta: { a: "¡AGENDAR MI SESIÓN DE DIAGNÓSTICO!" },
    testimonialsCtaSubtext: { a: "Solo 8 cupos nuevos por mes" },
    resultsHeadline: { a: "Tasa de exito del 100% en la pérdida de grasa de mis alumnos." },
    resultsSubheading: { a: "Si ellos pudieron, vos también podés." },
    resultsOverlayLabel: { a: "ESTE LUGAR ES PARA VOS" },
    resultsCalloutText: { a: "Agenda tu sesión de diagnóstico y unite a los +50 casos de éxito con mi método M90." },
    resultsFinalCtaSubtext: { a: "Solo 8 cupos nuevos por mes" },
  },
  footer: {
    brandLine: { a: "Manu Nuñez Fit" },
    copyright: { a: "© Manu Nuñez {year}. Todos los derechos reservados." },
    metaDisclaimer: { a: "Este sitio no forma parte ni está avalado por Meta (Facebook o Instagram). Facebook e Instagram son marcas registradas de Meta Platforms, Inc." },
    privacyLabel: { a: "Política de Privacidad" },
    termsLabel: { a: "Términos y Condiciones" },
  },
  notQualifiedPage: {
    message: { a: "Por el momento no tenemos un servicio acorde a lo que marcaste" },
  },
  contactPage: {
    thankYouMessage: { a: "¡Gracias! Pronto nos pondremos en contacto con vos." },
    followInstagramText: { a: "Me podés seguir en mi Instagram:" },
    instagramUrl: "https://www.instagram.com/manununez.fit/",
  },
  formLabels: {
    nameLabel: { a: "Nombre" },
    namePlaceholder: { a: "Tu Nombre Completo" },
    emailLabel: { a: "Correo electrónico" },
    emailPlaceholder: { a: "tu@email.com" },
    phoneLabel: { a: "Número de teléfono" },
    countryPlaceholder: { a: "País" },
    numberPlaceholder: { a: "Número" },
    phoneInvalidMessage: { a: "El número no parece válido" },
    phoneInvalidHint: { a: "Verificá que sea tu número sin el 0, sin el 15 y sin repetir el código de país. Ej: 1155667788" },
    objectiveTip: { a: 'Tip: si nos contás el "por qué", podemos ayudarte mucho mejor en la llamada.' },
    backButton: { a: "Atrás" },
    nextButton: { a: "Continuar" },
    loadingButton: { a: "Cargando..." },
    submitButton: { a: "Aceptar y Agendar" },
  },
  videoTestimonials: [],
  resultGallery: [
    { _id: "g1", weight: "-10kg en 3 meses", imageUrl: "/images/testimonios/testimonio-2.png" },
    { _id: "g2", weight: "-8kg en 3 meses", imageUrl: "/images/testimonios/testimonio-3.png" },
    { _id: "g3", weight: "-8kg en 3 meses", imageUrl: "/images/testimonios/testimonio-4.png" },
    { _id: "g4", weight: "-12kg en 3 meses", imageUrl: "/images/testimonios/testimonio-5.png" },
  ],
  calendlyPage: {
    title: { a: "Reservá tu sesión de diagnóstico" },
    subtitle: { a: "Elegí día y hora. La llamada dura 30 minutos." },
    pdText: { a: "En caso de no encontrar horarios disponibles escribime por WhatsApp." },
    eyebrow: { a: "" },
    urgentHeadline: { a: "¡Último paso! Elegí una fecha y hora que te queden cómodas y empezá hoy mismo!" },
  },
  thankyouPage: {
    title: { a: "¡Tu sesión está confirmada!" },
    subtitle: { a: "" },
    whatsappCtaText: { a: "Confirmar mi asistencia por WhatsApp" },
    whatsappPrefilledMessage: { a: "Hola Manu, confirmo mi asistencia a la reunión." },
    videoEmbedUrl: { a: "https://player-vz-5c2adb98-6a4.tv.pandavideo.com/embed/?v=069e112f-6e84-4b51-819b-379c77bc03b5" },
    loomEmbedUrl: { a: "https://www.loom.com/embed/ad79b71777f3410d9cea358340dc7e24" },
    loomSectionHeading: { a: "Mensaje de Manu" },
    introVideoUrl: { a: "https://player-vz-5c2adb98-6a4.tv.pandavideo.com/embed/?v=1de861f0-5f8b-45d4-ba82-18bd332f961a" },
    urgentBanner: { a: "¡Último paso! Confirmá y agendá para no perder tu cupo." },
    checklistLabel: { a: "Marcá los 3 pasos para confirmar tu lugar:" },
    check1: { a: "Voy a estar en un lugar tranquilo, sin interrupciones." },
    check2: { a: "Realmente quiero cambiar, y me voy a comprometer a hacerlo." },
    check3: { a: "Si no puedo asistir, reprogramo con anticipación para liberar el lugar." },
    cancellationWarning: { a: "En caso de no confirmar, tu llamada va a ser cancelada" },
    videoSectionHeading: { a: "¿Cómo funciona el método?" },
    faqHeading: { a: "Preguntas frecuentes" },
    scarcityMessage: { a: "Cupos limitados: si no confirmás, el sistema libera tu lugar automáticamente." },
    faqs: [
      {
        _id: "f1",
        question: { a: "¿Cuánto tiempo necesito para ver cambios?" },
        answer: { a: "El 90% ve el cambio más notorio en las primeras dos semanas; depende del punto de partida. Medimos con fotos, medidas y fuerza." },
      },
      {
        _id: "f2",
        question: { a: "¿Tengo que dejar de comer lo que me gusta?" },
        answer: { a: "No. Te enseñamos a incluir tus comidas favoritas sin sabotear tu progreso." },
      },
      {
        _id: "f3",
        question: { a: "No tengo tiempo todos los días, ¿igual puedo?" },
        answer: { a: "Sí. Planes efectivos de 3 sesiones siples/semana, 100% adaptados a tu agenda y ajustados constantemente según tus avances." },
      },
      {
        _id: "f4",
        question: { a: "Ya he intentado y no me ha funcionado, ¿qué tiene de diferente este programa?" },
        answer: { a: "No somos un nutricionista ni un coach generico, nos especializamos en ayudar a hombres +30 a lograr una recomposición corporal, no es solo pérdida de peso. Nos enfocamos en preservar y aumentar tu masa muscular mientras perdes grasa, lo que mejora tu metabolismo, salud hormonal y resultados a largo plazo. Además, el programa es 100% personalizado y adaptativo, ajustándose a tus necesidades y progreso." },
      },
    ],
  },
  formQuestions: [
    {
      _id: "q-contact", type: "contact", id: "contact",
      title: { a: "Completá tus datos para agendar tu sesión de diagnóstico y ver cómo te podemos ayudar." },
      subtitle: { a: "Tus datos son 100% confidenciales. Te tomará menos de 1 minuto." },
    },
    {
      _id: "q-cuerpo", type: "single", id: "cuerpo", required: true,
      title: { a: "¿Cómo describirías tu cuerpo hoy?*" },
      subtitle: { a: "No te preocupes, nadie va a juzgarte. Solo queremos entender por dónde empezar." },
      options: [
        { _id: "o-c1", value: "sobrepeso-15kg", label: { a: "Tengo sobrepeso (quiero perder más de 15 kg por salud)" } },
        { _id: "o-c2", value: "fuera-de-forma", label: { a: "Estoy fuera de forma (quiero perder entre 7 y 15 kg y quiero verme mejor)" } },
        { _id: "o-c3", value: "delgado-grasa", label: { a: "Soy delgado(a), pero tengo grasa rebelde que quiero eliminar y ganar músculo" } },
        { _id: "o-c4", value: "otro", label: { a: "Otro" } },
      ],
    },
    {
      _id: "q-urgencia", type: "single", id: "urgencia", required: true,
      title: { a: "¿Qué tan urgente es para ti cambiar tu cuerpo ahora mismo?*" },
      subtitle: { a: "Responde con total sinceridad. Esto nos ayuda a ver cómo ayudarte." },
      options: [
        { _id: "o-u1", value: "3", label: { a: "(3 de 10) Estoy buscando info. No es prioridad ahora." } },
        { _id: "o-u2", value: "5", label: { a: "(5 de 10) Quiero empezar pronto. Me estoy motivando." } },
        { _id: "o-u3", value: "7", label: { a: "(7 de 10) Quiero empezar ya. Me frustra cómo me siento y quiero recuperar mi salud y autoestima." } },
        { _id: "o-u4", value: "10", label: { a: "(10 de 10) No puedo esperar más. Esto me afecta física y mentalmente. Haré lo que haga falta." } },
      ],
    },
    {
      _id: "q-ocupacion", type: "single", id: "ocupacion", required: true,
      title: { a: "¿A qué te dedicas?*" },
      subtitle: { a: "Esto nos ayuda a adaptar tu alimentación y entrenamiento a tu estilo de vida." },
      options: [
        { _id: "o-o1", value: "negocio-propio", label: { a: "Tengo mi propio negocio con empleados" } },
        { _id: "o-o2", value: "profesional", label: { a: "Soy profesional (Abogado, Médico, Ingeniero, etc...)" } },
        { _id: "o-o3", value: "freelance", label: { a: "Freelance / Home office" } },
        { _id: "o-o4", value: "trabajador", label: { a: "Trabajo manual / fisico" } },
        { _id: "o-o5", value: "otro", label: { a: "Otro" } },
      ],
    },
    {
      _id: "q-compromiso90", type: "single", id: "compromiso90", required: true,
      title: { a: "¿Estás listo/a para comprometerte 90 días con tu cambio?*" },
      options: [
        { _id: "o-cp1", value: "si", label: { a: "Sí, sé que los cambios duraderos no se logran en 2 semanas." } },
        { _id: "o-cp2", value: "no", label: { a: "No, ahora no puedo comprometerme a 90 días." } },
      ],
    },
    {
      _id: "q-edad", type: "single", id: "edad", required: true,
      title: { a: "¿En qué rango de edad te encontrás?*" },
      options: [
        { _id: "o-e1", value: "menor", label: { a: "Soy menor de edad" } },
        { _id: "o-e2", value: "joven", label: { a: "18 - 24 años" } },
        { _id: "o-e3", value: "adulto", label: { a: "24 - 44 años" } },
        { _id: "o-e4", value: "mayor", label: { a: "+44 años" } },
      ],
    },
    {
      _id: "q-objetivo", type: "text", id: "objetivo", required: true,
      title: { a: "¿Cuál es tu objetivo de salud/calidad de vida y cómo querés sentirte para los próximos meses?*" },
      subtitle: { a: "Cuanto más nos cuentes, mejor podremos ayudarte." },
      placeholder: "Ej: Tener más energía, dejar de cansarme, sentirme bien con mi cuerpo, mejorar mi salud...",
    },
    {
      _id: "q-presupuesto", type: "single", id: "presupuesto", required: true,
      title: { a: "En caso de ser aceptado y sabiendo que es un servicio integral de 3 meses ¿Cuanto estas dispuesto a invertir en vos, tu salud y tu fisico y ser acompañado ayudandote a lograr tus objetivos de forma garantizada? *" },
      options: [
        { _id: "o-p1", value: "presupuesto-cuotas", label: { a: "Entre 200 y 300 y puedo acceder a un plan de pagos para el resto" } },
        { _id: "o-p2", value: "presupuesto-intermedio", label: { a: "Entre 300 y 850 USD" } },
        { _id: "o-p3", value: "presupuesto-alto", label: { a: "Entre 850 y 1.200 USD" } },
        { _id: "o-p4", value: "presupuesto-bajo", label: { a: "No estoy dispuesto a invertir en mi fisico y salud por más de que se que en 3 meses podria tener cambios como los que vi" } },
      ],
    },
  ],
  legalPages: {
    privacy: DEFAULT_PRIVACY,
    terms: DEFAULT_TERMS,
  },
};

const hasBlobToken = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

async function readBlobJson(prefix: string): Promise<Content | null> {
  if (!hasBlobToken()) return null;
  try {
    const { blobs } = await list({
      prefix,
      limit: 1,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    const blob = blobs[0];
    if (!blob) return null;
    const r = await fetch(blob.url, { cache: "no-store" });
    if (!r.ok) return null;
    return (await r.json()) as Content;
  } catch (e) {
    console.error("[content] Blob read failed:", prefix, e);
    return null;
  }
}

async function readLocalJson(file: string): Promise<Content | null> {
  try {
    const txt = await fs.readFile(file, "utf-8");
    return JSON.parse(txt) as Content;
  } catch {
    return null;
  }
}

async function writeBlobJson(prefix: string, content: Content): Promise<boolean> {
  if (!hasBlobToken()) return false;
  try {
    await put(prefix, JSON.stringify(content, null, 2), {
      contentType: "application/json",
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return true;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[content] Blob put failed:", prefix, msg);
    throw new Error(`Blob put failed (${prefix}): ${msg}`);
  }
}

async function writeLocalJson(file: string, content: Content): Promise<void> {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(content, null, 2), "utf-8");
}

async function isPreviewRequest(): Promise<boolean> {
  try {
    const c = await cookies();
    return c.get(PREVIEW_COOKIE)?.value === "1";
  } catch {
    return false;
  }
}

export async function getContent(): Promise<Content> {
  if (await isPreviewRequest()) {
    noStore();
    const draft =
      (await readBlobJson(DRAFT_BLOB_PATH)) ??
      (await readLocalJson(LOCAL_DRAFT_FILE));
    if (draft) return draft;
  }
  return (
    (await readBlobJson(CONTENT_BLOB_PATH)) ??
    (await readLocalJson(LOCAL_CONTENT_FILE)) ??
    DEFAULT_CONTENT
  );
}

// En Vercel el filesystem es read-only — no podemos caer al fallback local.
// Si no hay token de Blob en producción, mejor fallar rápido con mensaje claro.
function isServerlessProd(): boolean {
  return process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
}

export async function saveContent(content: Content): Promise<void> {
  if (await writeBlobJson(CONTENT_BLOB_PATH, content)) return;
  if (isServerlessProd()) {
    throw new Error("BLOB_READ_WRITE_TOKEN no configurado en producción — seteá la env var en Vercel para poder guardar el contenido.");
  }
  await writeLocalJson(LOCAL_CONTENT_FILE, content);
}

export async function saveDraftContent(content: Content): Promise<void> {
  if (await writeBlobJson(DRAFT_BLOB_PATH, content)) return;
  if (isServerlessProd()) {
    throw new Error("BLOB_READ_WRITE_TOKEN no configurado en producción — seteá la env var en Vercel para poder guardar el draft.");
  }
  await writeLocalJson(LOCAL_DRAFT_FILE, content);
}

