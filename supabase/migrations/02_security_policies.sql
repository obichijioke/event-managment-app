-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizers ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlists ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile"
    ON users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON users FOR UPDATE
    USING (auth.uid() = id);

-- Organizers policies
CREATE POLICY "Anyone can view organizers"
    ON organizers FOR SELECT
    TO PUBLIC
    USING (true);

CREATE POLICY "Organizers can update their own profile"
    ON organizers FOR UPDATE
    USING (auth.uid() = id);

-- Venues policies
CREATE POLICY "Anyone can view venues"
    ON venues FOR SELECT
    TO PUBLIC
    USING (true);

CREATE POLICY "Organizers can create venues"
    ON venues FOR INSERT
    TO authenticated
    WITH CHECK (EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.role = 'organizer'
    ));

CREATE POLICY "Organizers can update venues"
    ON venues FOR UPDATE
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.role = 'organizer'
    ));

-- Events policies
CREATE POLICY "Events are viewable by everyone"
    ON events FOR SELECT
    USING (status = 'published');

CREATE POLICY "Users can view all their own events"
    ON events FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Organizers can create events"
    ON events FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = user_id
        AND EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'organizer'
        )
    );

CREATE POLICY "Users can update their own events"
    ON events FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own events"
    ON events FOR DELETE
    USING (auth.uid() = user_id);

-- Tickets policies
CREATE POLICY "Anyone can view tickets for published events"
    ON tickets FOR SELECT
    TO PUBLIC
    USING (
        EXISTS (
            SELECT 1 FROM events
            WHERE events.id = event_id
            AND events.status = 'published'
        )
    );

CREATE POLICY "Organizers can manage tickets for their events"
    ON tickets FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM events
            WHERE events.id = event_id
            AND events.organizer_id = auth.uid()
        )
    );

-- Orders policies
CREATE POLICY "Users can view their own orders"
    ON orders FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can create orders"
    ON orders FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

-- Order items policies
CREATE POLICY "Users can view their own order items"
    ON order_items FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_id
            AND orders.user_id = auth.uid()
        )
    );

-- Ticket reservations policies
CREATE POLICY "Users can view their own reservations"
    ON ticket_reservations FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can create reservations"
    ON ticket_reservations FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

-- Watchlists policies
CREATE POLICY "Users can manage their watchlist"
    ON watchlists FOR ALL
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id
        AND (
            CASE
                WHEN role IS DISTINCT FROM OLD.role THEN
                    -- Only admins can change roles
                    EXISTS (
                        SELECT 1 FROM profiles
                        WHERE id = auth.uid()
                        AND role = 'admin'
                    )
                ELSE true
            END
        )
    );

-- Function to check if user is organizer
CREATE OR REPLACE FUNCTION is_organizer(user_id uuid)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = user_id
    AND role = 'organizer'
  );
$$; 