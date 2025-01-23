import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import EventPageClient from "./client";

export default async function EventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const eventId = (await params).eventId;

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <EventPageClient eventId={eventId} />
    </Suspense>
  );
}
