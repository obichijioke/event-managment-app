import { createClient } from "@/lib/supabase/client";
import { TicketFormData } from "@/types";

const supabase = createClient();

export const ticketService = {
  // Create a new ticket type for an event
  async createTicket(eventId: string, data: TicketFormData) {
    try {
      const { data: ticket, error } = await supabase
        .from("tickets")
        .insert([
          {
            event_id: eventId,
            name: data.name,
            description: data.description,
            price: data.price,
            quantity_available: data.quantity_available,
            sale_start_time: data.sale_start_time,
            sale_end_time: data.sale_end_time,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return ticket;
    } catch (error) {
      console.error("Error creating ticket:", error);
      throw error;
    }
  },

  // Get all tickets for an event
  async getEventTickets(eventId: string) {
    try {
      const { data: tickets, error } = await supabase
        .from("tickets")
        .select("*")
        .eq("event_id", eventId);

      if (error) throw error;
      return tickets;
    } catch (error) {
      console.error("Error fetching event tickets:", error);
      throw error;
    }
  },

  // Update a ticket
  async updateTicket(ticketId: string, data: Partial<TicketFormData>) {
    try {
      const { data: ticket, error } = await supabase
        .from("tickets")
        .update({
          name: data.name,
          description: data.description,
          price: data.price,
          quantity_available: data.quantity_available,
          sale_start_time: data.sale_start_time,
          sale_end_time: data.sale_end_time,
        })
        .eq("id", ticketId)
        .select()
        .single();

      if (error) throw error;
      return ticket;
    } catch (error) {
      console.error("Error updating ticket:", error);
      throw error;
    }
  },

  // Delete a ticket
  async deleteTicket(ticketId: string) {
    try {
      const { error } = await supabase
        .from("tickets")
        .delete()
        .eq("id", ticketId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting ticket:", error);
      throw error;
    }
  },

  // Reserve tickets
  async reserveTickets(ticketId: string, quantity: number) {
    try {
      const session = await supabase.auth.getSession();
      const userId = session.data.session?.user.id;
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 15); // 15-minute reservation

      const { data: reservation, error } = await supabase
        .from("ticket_reservations")
        .insert([
          {
            user_id: userId,
            ticket_id: ticketId,
            quantity: quantity,
            expires_at: expiresAt.toISOString(),
            status: "pending",
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return reservation;
    } catch (error) {
      console.error("Error reserving tickets:", error);
      throw error;
    }
  },

  // Purchase tickets
  async purchaseTickets(
    ticketId: string,
    quantity: number,
    paymentData: {
      payment_method: string;
      transaction_id: string;
    }
  ) {
    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session?.user.id) throw new Error("Not authenticated");

      // Get ticket price
      const { data: ticket } = await supabase
        .from("tickets")
        .select("price")
        .eq("id", ticketId)
        .single();

      if (!ticket) throw new Error("Ticket not found");

      const totalAmount = ticket.price * quantity;

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            user_id: session.data.session.user.id,
            total_amount: totalAmount,
            payment_status: "paid",
            payment_method: paymentData.payment_method,
            transaction_id: paymentData.transaction_id,
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order item
      const { error: itemError } = await supabase.from("order_items").insert([
        {
          order_id: order.id,
          ticket_id: ticketId,
          quantity: quantity,
          price_per_item: ticket.price,
        },
      ]);

      if (itemError) throw itemError;

      // Update ticket quantity
      const { error: updateError } = await supabase
        .from("tickets")
        .update({
          quantity_available: supabase.rpc("update_ticket_quantity", {
            p_ticket_id: ticketId,
            p_quantity: quantity,
          }),
        })
        .eq("id", ticketId);

      if (updateError) throw updateError;

      return order;
    } catch (error) {
      console.error("Error purchasing tickets:", error);
      throw error;
    }
  },

  // Check ticket availability
  async checkTicketAvailability(ticketId: string, quantity: number) {
    try {
      const { data: ticket, error } = await supabase
        .from("tickets")
        .select("quantity_available")
        .eq("id", ticketId)
        .single();

      if (error) throw error;
      return ticket.quantity_available >= quantity;
    } catch (error) {
      console.error("Error checking ticket availability:", error);
      throw error;
    }
  },
};
