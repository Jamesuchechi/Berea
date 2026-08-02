import { supabase } from '../lib/supabase';

/**
 * Trigger Real Google OAuth Redirect via Supabase
 */
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}`
    }
  });

  if (error) {
    console.error("Google OAuth error:", error.message);
    alert(`Google Authentication Error: ${error.message}`);
    throw error;
  }

  return data;
}

/**
 * Sign in with Email & Password
 */
export async function signInWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Sign up with Email & Password
 */
export async function signUpWithEmail(email, password, tradition = 'Protestant') {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { tradition },
      emailRedirectTo: `${window.location.origin}`
    }
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Verify Email OTP Security Code
 */
export async function verifyOtpCode(email, token) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email'
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Sign out current user
 */
export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) console.warn("Signout error:", error.message);
  localStorage.removeItem('berea_auth');
}

/**
 * Subscribe to Supabase Auth State Changes
 */
export function listenToAuthState(callback) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
}
