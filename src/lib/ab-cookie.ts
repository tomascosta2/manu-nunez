// Edge-safe types and helpers (no Node imports)
export const AB_COOKIE = "mg_ab_variant";
export type Variant = "A" | "B";

// A/B test wrapper para cada campo testeable.
// El test sólo está "activo" si su `testId` coincide con `activeTestId` del Content.
// Esto fuerza que solo UN test corra a la vez en todo el funnel.
export type AB = { a?: string; b?: string };

export function pickVariant(field: AB | undefined, variant: Variant, isActive: boolean): string {
  if (!field) return "";
  if (variant === "B" && isActive && field.b) return field.b;
  return field.a ?? "";
}

export function isTestActive(activeTestId: string | undefined, testId: string): boolean {
  return activeTestId === testId;
}
