const ADMIN_SESSION_COOKIE = 'admin_session'
const ADMIN_HINT_COOKIE = 'is_admin'
const ADMIN_SESSION_MESSAGE = 'admin-session'
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365

export const createAdminSessionCookies = async (secret: string, requestUrl: string): Promise<string[]> => {
  const secure = new URL(requestUrl).protocol === 'https:' ? '; Secure' : ''
  const signature = await hmacHex(secret, ADMIN_SESSION_MESSAGE)
  return [
    `${ADMIN_SESSION_COOKIE}=${signature}; Max-Age=${ONE_YEAR_SECONDS}; Path=/; HttpOnly; SameSite=Lax${secure}`,
    `${ADMIN_HINT_COOKIE}=1; Max-Age=${ONE_YEAR_SECONDS}; Path=/; SameSite=Lax${secure}`,
  ]
}

export const clearAdminSessionCookies = (requestUrl: string): string[] => {
  const secure = new URL(requestUrl).protocol === 'https:' ? '; Secure' : ''
  return [
    `${ADMIN_SESSION_COOKIE}=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax${secure}`,
    `${ADMIN_HINT_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax${secure}`,
  ]
}

export const hasAdminSession = async (request: Request, secret: string): Promise<boolean> => {
  if (secret.length === 0) return false

  const cookieHeader = request.headers.get('Cookie')
  if (cookieHeader == null) return false

  const session = cookieHeader
    .split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${ADMIN_SESSION_COOKIE}=`))
    ?.slice(ADMIN_SESSION_COOKIE.length + 1)

  if (session == null) return false

  const expected = await hmacHex(secret, ADMIN_SESSION_MESSAGE)
  return ctEqual(toUint8a(session), toUint8a(expected))
}

// 生のsecretをcookieに保持しないよう、固定メッセージのHMACを署名として使う
const hmacHex = async (secret: string, message: string): Promise<string> => {
  const key = await crypto.subtle.importKey('raw', toUint8a(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
  ])
  const signature = await crypto.subtle.sign('HMAC', key, toUint8a(message))
  return toHex(new Uint8Array(signature))
}

const toHex = (bytes: Uint8Array): string => {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

export const ctEqual = (a: Uint8Array, b: Uint8Array): boolean => {
  if (a.length !== b.length || a.length === 0) return false
  const n = a.length
  let c = 0
  for (let i = 0; i < n; i++) {
    c |= a[i]! ^ b[i]!
  }
  return c === 0
}

export const toUint8a = (str: string) => new TextEncoder().encode(str)
