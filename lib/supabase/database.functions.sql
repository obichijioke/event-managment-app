-- Update ticket quantity
CREATE OR REPLACE FUNCTION update_ticket_quantity(p_ticket_id UUID, p_quantity INT)
RETURNS void AS $$
BEGIN
  UPDATE tickets
  SET quantity_sold = quantity_sold + p_quantity,
      quantity_available = quantity - (quantity_sold + p_quantity)
  WHERE id = p_ticket_id;
END;
$$ LANGUAGE plpgsql;

-- Get event analytics
CREATE OR REPLACE FUNCTION get_event_analytics(event_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  WITH ticket_sales AS (
    SELECT 
      t.name as ticket_type,
      COUNT(tp.id) as quantity_sold,
      SUM(tp.unit_price * tp.quantity) as revenue
    FROM tickets t
    LEFT JOIN ticket_purchases tp ON t.id = tp.ticket_id
    WHERE t.event_id = $1
    GROUP BY t.name
  ),
  daily_sales AS (
    SELECT 
      DATE(o.created_at) as sale_date,
      COUNT(tp.id) as tickets_sold,
      SUM(tp.unit_price * tp.quantity) as revenue
    FROM orders o
    JOIN ticket_purchases tp ON o.id = tp.order_id
    JOIN tickets t ON tp.ticket_id = t.id
    WHERE t.event_id = $1
    GROUP BY DATE(o.created_at)
  )
  SELECT json_build_object(
    'total_tickets_sold', (SELECT SUM(quantity_sold) FROM tickets WHERE event_id = $1),
    'total_revenue', (SELECT SUM(revenue) FROM ticket_sales),
    'tickets_by_type', (SELECT json_agg(ticket_sales) FROM ticket_sales),
    'sales_by_date', (SELECT json_agg(daily_sales) FROM daily_sales)
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Get category analytics
CREATE OR REPLACE FUNCTION get_category_analytics(category_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  WITH event_stats AS (
    SELECT 
      status,
      COUNT(*) as count
    FROM events
    WHERE category_id = $1
    GROUP BY status
  )
  SELECT json_build_object(
    'total_events', (SELECT COUNT(*) FROM events WHERE category_id = $1),
    'total_tickets_sold', (
      SELECT COALESCE(SUM(t.quantity_sold), 0)
      FROM events e
      JOIN tickets t ON e.id = t.event_id
      WHERE e.category_id = $1
    ),
    'total_revenue', (
      SELECT COALESCE(SUM(tp.unit_price * tp.quantity), 0)
      FROM events e
      JOIN tickets t ON e.id = t.event_id
      JOIN ticket_purchases tp ON t.id = tp.ticket_id
      WHERE e.category_id = $1
    ),
    'events_by_status', (SELECT json_agg(event_stats) FROM event_stats)
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Get user analytics
CREATE OR REPLACE FUNCTION get_user_analytics(user_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  WITH category_stats AS (
    SELECT 
      c.name as category,
      COUNT(DISTINCT e.id) as count
    FROM events e
    JOIN categories c ON e.category_id = c.id
    WHERE e.organizer_id = $1
    GROUP BY c.name
  )
  SELECT json_build_object(
    'total_events_organized', (SELECT COUNT(*) FROM events WHERE organizer_id = $1),
    'total_tickets_purchased', (
      SELECT COALESCE(SUM(tp.quantity), 0)
      FROM ticket_purchases tp
      JOIN orders o ON tp.order_id = o.id
      WHERE o.user_id = $1
    ),
    'total_spent', (
      SELECT COALESCE(SUM(tp.unit_price * tp.quantity), 0)
      FROM ticket_purchases tp
      JOIN orders o ON tp.order_id = o.id
      WHERE o.user_id = $1
    ),
    'events_by_category', (SELECT json_agg(category_stats) FROM category_stats)
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql; 