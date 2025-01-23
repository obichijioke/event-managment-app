import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import EventPageClient from "./client";

interface EventPageProps {
  params: {
    eventId: string;
  };
}

export default async function EventPage({ params }: EventPageProps) {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <EventPageClient eventId={params.eventId} />
    </Suspense>
  );
}
