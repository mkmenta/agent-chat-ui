export const COOKIE_NAME = "auth_session";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function createSessionToken(secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode("authenticated"),
  );
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

export async function verifySessionToken(
  secret: string,
  token: string,
): Promise<boolean> {
  try {
    const expected = await createSessionToken(secret);
    return token === expected;
  } catch {
    return false;
  }
}
