-- Drop existing venue policies
DROP POLICY IF EXISTS "Organizers can create venues" ON venues;
DROP POLICY IF EXISTS "Organizers can update venues" ON venues;

-- Recreate venue policies using profiles table
CREATE POLICY "Organizers can create venues"
    ON venues FOR INSERT
    TO authenticated
    WITH CHECK (EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'organizer'
    ));

CREATE POLICY "Organizers can update venues"
    ON venues FOR UPDATE
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'organizer'
    )); 