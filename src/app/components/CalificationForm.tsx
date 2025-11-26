'use client'
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

const PREGUNTAS = {
	urgencia: {
		label: "¿Para cuándo te gustaría tener estos resultados? *",
		opciones: [
			{ value: "urgencia-baja", label: "Estoy bien físicamente" },
			{ value: "urgencia-intermedia", label: "En los proximos meses" },
			{ value: "urgencia-alta", label: "Ya mismo, necesito un cambio" },
		],
	},
	presupuesto: {
		label:
			"¿Qué tipo solución estás buscando para transformar tu físico? *",
		opciones: [
			{ value: "presupuesto-bajo", label: "Quiero una solución económica para empezar por mi cuenta." },
			{ value: "presupuesto-intermedio", label: "Quiero un plan serio, que justifique la inversión." },
			{ value: "presupuesto-alto", label: "Quiero la mejor opción disponible, independientemente del precio." },
		],
	},
};

const PAISES = [
	{ code: "+54", name: "Argentina", flag: "🇦🇷" },
	{ code: "+1", name: "Estados Unidos / Canadá", flag: "🇺🇸" },
	{ code: "+52", name: "México", flag: "🇲🇽" },
	{ code: "+34", name: "España", flag: "🇪🇸" },
	{ code: "+57", name: "Colombia", flag: "🇨🇴" },
	{ code: "+51", name: "Perú", flag: "🇵🇪" },
	{ code: "+56", name: "Chile", flag: "🇨🇱" },
	{ code: "+58", name: "Venezuela", flag: "🇻🇪" },
	{ code: "+593", name: "Ecuador", flag: "🇪🇨" },
	{ code: "+591", name: "Bolivia", flag: "🇧🇴" },
	{ code: "+595", name: "Paraguay", flag: "🇵🇾" },
	{ code: "+598", name: "Uruguay", flag: "🇺🇾" },
	{ code: "+55", name: "Brasil", flag: "🇧🇷" },
	{ code: "+506", name: "Costa Rica", flag: "🇨🇷" },
	{ code: "+507", name: "Panamá", flag: "🇵🇦" },
	{ code: "+503", name: "El Salvador", flag: "🇸🇻" },
	{ code: "+502", name: "Guatemala", flag: "🇬🇹" },
	{ code: "+504", name: "Honduras", flag: "🇭🇳" },
	{ code: "+505", name: "Nicaragua", flag: "🇳🇮" },
	{ code: "+1-809", name: "República Dominicana", flag: "🇩🇴" },
]

interface Props {
	defaultEmail: string;
}

export default function CalificationForm() {
	const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();

	const [showRadios, setShowRadios] = useState(false)
	const [loading, setLoading] = useState(false);

	const name = watch("name");
	const email = watch("email");
	const telefono = watch("telefono");

	// Mostramos radios solo si los campos están llenos y válidos
	useEffect(() => {
		const isNameValid = name?.trim().length > 1;
		const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
		const isPhoneValid = telefono?.trim().length > 5;

		if (isNameValid && isEmailValid && isPhoneValid) {
			setShowRadios(true);
		}
	}, [name, email, telefono]);

	const onSubmit = async (data: any) => {

		setLoading(true);

		try {

			// Definimos si va a ser el test A o B
			const variant = Math.random() < 0.5 ? 'vsl-w-calendy' : 'vsl-w-button';

			// Enviamos los datos al Google Sheets
			const payload = {
				...data,
				variant
			}
			await fetch(`https://hook.us2.make.com/4440nxy5471reiw1q18qotjc15rveijb`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify([payload]),
			});

			const isQualified =
				(data.presupuesto === 'presupuesto-intermedio' || data.presupuesto === 'presupuesto-alto') &&
				(data.urgencia === 'urgencia-intermedia' || data.urgencia === 'urgencia-alta');

			// ✅ Guardar si está calificado
			localStorage.setItem('isQualified', isQualified ? 'true' : 'false');

			const fbp = document.cookie
				.split('; ')
				.find(row => row.startsWith('_fbp='))
				?.split('=')[1] || null;

			function getCookieValue(cookieName: any) {
				const name = cookieName + "=";
				const decodedCookie = decodeURIComponent(document.cookie);
				const ca = decodedCookie.split(';');
				for (let i = 0; i < ca.length; i++) {
					let c = ca[i].trim();
					if (c.indexOf(name) === 0) {
						return c.substring(name.length, c.length);
					}
				}
				return "";
			}

			// To get the _fbc cookie value:
			const fbc = getCookieValue('_fbc');
			console.log("FBC Cookie Value:", fbc);

			if (isQualified) {
				// Enviamos a Meta el Lead
				await fetch('/api/track/lead', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						email: data.email,
						phone: `${data.codigoPais}${data.telefono}`,
						fbp,
						fbc,
						eventId: `lead-${Date.now()}`,
					}),
				});

				if (variant === 'vsl-w-calendy') {
					window.location.href = '/pages/vsl-w-calendly/?lead=true';
				} else {
					window.location.href = '/pages/vsl/?lead=true';
				}

			} else {

				if (variant === 'vsl-w-calendy') {
					window.location.href = '/pages/vsl-w-calendly/?lead=true';
				} else {
					window.location.href = '/pages/vsl/?lead=true';
				}
				
			}

			localStorage.setItem('email', data.email);
			localStorage.setItem('phone', `${data.codigoPais}${data.telefono}`);

		} catch (e) {
			console.log("Error: ", e)
		}


	};

	useEffect(() => {
		const searchParams = new URLSearchParams(window.location.search);
		const adParam = searchParams.get("ad");

		if (adParam) {
			reset((prev) => ({
				...prev,
				ad: adParam,
			}));
		}
	}, [reset]);

	const body = document.querySelector('body');
	body?.classList.add('overflow-hidden')

	return (
		<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
			<div className="md:border md:border-white/20 md:rounded-[20px] py-[55px] px-[40px] bg-[#111] max-w-[500px] h-full md:max-h-[calc(100vh-80px)] overflow-y-auto">
				<h2 className="mb-4 font-bold text-[18px] md:text-[22px] leading-[113%] italic">Completa el formulario para saber si somos un buen fit, y <span className="text-[#0051ff]">agenda tu consulta gratuita</span> para empezar tu cambio</h2>

				<form onSubmit={handleSubmit(onSubmit)}>
					{/* Nombre */}
					<label className="text-white block">
						Nombre:
						<input
							type="text"
							{...register("name", { required: "Campo requerido" })}
							className="bg-white outline-0 py-2 px-4 rounded-lg block w-full mt-2 text-[#111]/80"
							placeholder="Tu Nombre Completo"
							autoComplete="name"
							required
						/>
					</label>

					{/* Email pre-cargado */}
					<label className="text-white block mt-6">
						Correo electrónico:
						<input
							type="email"
							{...register("email", { required: "Campo requerido" })}
							className="bg-white outline-0 py-2 px-4 rounded-lg block w-full mt-2 text-[#111]/80"
							placeholder="Tu correo electronico"
							autoComplete="email"
							required
						/>
					</label>

					{/* Campo de teléfono */}
					<div className="mt-6">
						<label className="text-white block mb-2">Número de teléfono:</label>
						<div className="flex bg-white rounded-lg max-w-full">
							<select
								{...register("codigoPais", { required: "Campo requerido" })}
								className="bg-white py-2 px-3 rounded-lg text-[#111]/80 outline-0"
								required
							>
								{PAISES.map((pais) => (
									<option key={pais.code} value={pais.code}>
										{pais.flag}
									</option>
								))}
							</select>
							<input
								type="tel"
								{...register("telefono", {
									required: "Campo requerido",
									pattern: {
										value: /^[0-9\s\-$$$$]+$/,
										message: "Formato de teléfono inválido",
									},
								})}
								className="bg-white py-2 w-full px-4 rounded-lg flex-1 text-[#111]/80 outline-0"
								placeholder="Número de teléfono"
								autoComplete="tel"
								required
							/>
						</div>
						{errors.codigoPais && (
							<span className="text-red-500 text-sm block mt-1">{(errors as any).codigoPais.message}</span>
						)}
						{errors.telefono && (
							<span className="text-red-500 text-sm block mt-1">{(errors as any).telefono.message}</span>
						)}
					</div>

					{/* Radios dinámicos */}
					{showRadios && (
						Object.entries(PREGUNTAS).map(([key, pregunta]) => (
							<div key={key} className="mt-6">
								<p className="text-white font-medium mb-2">{pregunta.label}</p>
								{pregunta.opciones.map((op) => (
									<label key={op.value} className="flex items-center gap-2 mb-1">
										<input
											type="radio"
											value={op.value}
											{...register(key, { required: "Campo requerido" })}
											className="accent-[#3B4FFF]"
										/>
										<span className="text-white">{op.label}</span>
									</label>
								))}
								{errors[key] && (
									<span className="text-red-500 text-sm">
										{(errors as any)[key].message}
									</span>
								)}
							</div>
						))
					)}

					<input type="hidden" {...register("ad")} />

					<button
						type="submit"
						className="mt-8 cf-btn"
						disabled={loading}
					>
						{loading ? "Cargando..." : "QUIERO VER COMO FUNCIONA"}
					</button>
					<p className="text-white/80 mt-4 text-[12px]">PD: El método FIT90 está diseñado para hombres ocupados, no es la típica rutina de influencer que solo puede cumplir un adolescente que vive con los padres.</p>
				</form>
			</div>
		</div>
	);
}
