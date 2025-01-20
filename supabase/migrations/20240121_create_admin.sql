-- Temporarily disable the role check trigger
ALTER TABLE profiles DISABLE TRIGGER check_profile_role_update;

-- Update the first user to be an admin (adjust the email to match your user)
DO $$ 
BEGIN
    -- Try to update the first user to admin
    UPDATE profiles 
    SET role = 'admin'
    WHERE id = (
        SELECT id 
        FROM profiles 
        ORDER BY created_at 
        LIMIT 1
    );

    -- Verify we have at least one admin
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE role = 'admin') THEN
        RAISE EXCEPTION 'Failed to create admin user';
    END IF;
END $$;

-- Re-enable the role check trigger
ALTER TABLE profiles ENABLE TRIGGER check_profile_role_update; 