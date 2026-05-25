import { cookies } from "next/headers";
import { getContent } from "@/lib/content";
import { AB_COOKIE, pickVariant, isTestActive, type Variant } from "@/lib/ab-cookie";

export const revalidate = 60;

export default async function Unqualified() {
	const data = await getContent();
	const c = await cookies();
	const variant: Variant = c.get(AB_COOKIE)?.value === "B" ? "B" : "A";
	const t = data.activeTestId;
	const message = pickVariant(data.notQualifiedPage?.message, variant, isTestActive(t, "notQualifiedPage.message")) || "";

	return (
		<>
			<section className="py-[100px] px-4">
				<h1 className="text-center max-w-[800px] mx-auto text-[32px] leading-[110%] font-bold">{message}</h1>
			</section>
		</>
	);
}
