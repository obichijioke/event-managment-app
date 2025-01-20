-- Add user_id to events table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'events' AND column_name = 'user_id') THEN
        ALTER TABLE events ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Update existing events to set user_id from organizer_id
UPDATE events
SET user_id = organizer_id
WHERE user_id IS NULL;

-- Make user_id NOT NULL after setting values
ALTER TABLE events ALTER COLUMN user_id SET NOT NULL;

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT,
    email TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'organizer', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS on profiles if not already enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create or replace the handle_updated_at function
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at trigger to profiles if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_profiles_updated_at') THEN
        CREATE TRIGGER handle_profiles_updated_at
            BEFORE UPDATE ON profiles
            FOR EACH ROW
            EXECUTE FUNCTION handle_updated_at();
    END IF;
END $$;

-- Create or replace the handle_new_user function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email)
    VALUES (NEW.id, NEW.email);
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER SET search_path = public;

-- Add trigger for new user creation if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
        CREATE TRIGGER on_auth_user_created
            AFTER INSERT ON auth.users
            FOR EACH ROW
            EXECUTE FUNCTION handle_new_user();
    END IF;
END $$;

-- Create profiles for existing users if they don't have one
INSERT INTO profiles (id, email, role)
SELECT au.id, au.email, 'user'
FROM auth.users au
LEFT JOIN profiles p ON p.id = au.id
WHERE p.id IS NULL;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = user_id
    AND role = 'admin'
  );
$$;

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

-- Update security policies
DO $$ 
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Events are viewable by everyone" ON events;
    DROP POLICY IF EXISTS "Users can view all their own events" ON events;
    DROP POLICY IF EXISTS "Organizers can create events" ON events;
    DROP POLICY IF EXISTS "Users can update their own events" ON events;
    DROP POLICY IF EXISTS "Users can delete their own events" ON events;
    DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
    DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
END $$;

-- Recreate policies
CREATE POLICY "Events are viewable by everyone"
    ON events FOR SELECT
    USING (status = 'published');

CREATE POLICY "Users can view all their own events"
    ON events FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Organizers can create events"
    ON events FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
        AND is_organizer(auth.uid())
    );

CREATE POLICY "Users can update their own events"
    ON events FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own events"
    ON events FOR DELETE
    USING (auth.uid() = user_id);

CREATE POLICY "Profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

-- Create a function to handle profile role updates
CREATE OR REPLACE FUNCTION check_profile_update()
RETURNS TRIGGER AS $$
BEGIN
    -- If role is being changed
    IF NEW.role IS DISTINCT FROM OLD.role THEN
        -- Allow role change if there are no admins yet
        IF NOT EXISTS (SELECT 1 FROM profiles WHERE role = 'admin') THEN
            RETURN NEW;
        END IF;
        
        -- Only allow if user is admin
        IF NOT is_admin(auth.uid()) THEN
            RAISE EXCEPTION 'Only administrators can change roles';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ language plpgsql SECURITY DEFINER;

-- Create trigger for profile updates
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'check_profile_role_update') THEN
        CREATE TRIGGER check_profile_role_update
            BEFORE UPDATE ON profiles
            FOR EACH ROW
            EXECUTE FUNCTION check_profile_update();
    END IF;
END $$;

-- Create the basic profile update policy
CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id); 