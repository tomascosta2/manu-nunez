"use client";

import { useAdmin } from "../AdminProvider";
import { ABInput, Card, PageHeader } from "../ui";

export default function NoCalificaPage() {
  const { content, setContent } = useAdmin();
  const update = (patch: Partial<NonNullable<typeof content.notQualifiedPage>>) =>
    setContent({ ...content, notQualifiedPage: { ...content.notQualifiedPage, ...patch } });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Página /pages/nothing-for-you-now"
        description="Se muestra al lead que no califica según las respuestas del formulario."
      />
      <Card>
        <ABInput
          testId="notQualifiedPage.message"
          label="Mensaje principal"
          value={content.notQualifiedPage?.message}
          onChange={(message) => update({ message })}
          multiline
        />
      </Card>
    </div>
  );
}
