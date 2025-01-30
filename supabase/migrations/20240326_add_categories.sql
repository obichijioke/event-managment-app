-- Create categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Add updated_at trigger to categories
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create categories policies
CREATE POLICY "Categories are viewable by everyone"
    ON categories FOR SELECT
    TO PUBLIC
    USING (true);

CREATE POLICY "Only admins can manage categories"
    ON categories FOR ALL
    TO authenticated
    USING (is_admin(auth.uid()));

-- Create some default categories
INSERT INTO categories (name, description, slug) VALUES
    ('Music', 'Concerts, festivals, and live performances', 'music'),
    ('Sports', 'Sporting events and competitions', 'sports'),
    ('Business', 'Conferences, networking, and professional events', 'business'),
    ('Technology', 'Tech conferences, hackathons, and meetups', 'technology'),
    ('Arts & Culture', 'Art exhibitions, theater, and cultural events', 'arts-culture'),
    ('Food & Drink', 'Food festivals, wine tastings, and culinary events', 'food-drink'),
    ('Community', 'Local community gatherings and meetups', 'community'),
    ('Education', 'Workshops, seminars, and educational events', 'education');

-- Add category_id to events table
ALTER TABLE events ADD COLUMN category_id UUID REFERENCES categories(id);

-- Migrate existing categories to the new system
DO $$
DECLARE
    event_record RECORD;
    category_id UUID;
BEGIN
    FOR event_record IN (SELECT id, category FROM events WHERE category IS NOT NULL) LOOP
        -- Try to find a matching category
        SELECT id INTO category_id 
        FROM categories 
        WHERE LOWER(name) = LOWER(event_record.category)
        OR LOWER(name) LIKE LOWER('%' || event_record.category || '%')
        LIMIT 1;

        -- Update the event with the new category_id
        IF category_id IS NOT NULL THEN
            UPDATE events 
            SET category_id = category_id 
            WHERE id = event_record.id;
        END IF;
    END LOOP;
END $$;

-- Drop the old category column
ALTER TABLE events DROP COLUMN category;

-- Create index on category_id
CREATE INDEX idx_events_category_id ON events(category_id); 