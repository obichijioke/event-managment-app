import { NewTicketForm } from "./NewTicketForm";

export default async function NewTicketPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  return <NewTicketForm eventId={eventId} />;
}
