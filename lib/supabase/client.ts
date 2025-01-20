import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function signInWithEmail(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred during sign in",
    };
  }
}

export async function getSession() {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) throw error;
    return { session, error: null };
  } catch (error) {
    return {
      session: null,
      error: error instanceof Error ? error.message : "Failed to get session",
    };
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    return { error: null };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "An error occurred during sign out",
    };
  }
}

export async function signUpWithEmail(
  email: string,
  password: string,
  firstName: string,
  lastName: string
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: "user",
        first_name: firstName,
        last_name: lastName,
      },
    },
  });

  if (error) {
    throw error;
  }

  return {
    data,
    error: null,
    requiresEmailConfirmation: !data.user?.confirmed_at,
  };
}
