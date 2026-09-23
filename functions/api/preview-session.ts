const PREVIEW_SESSION_COOKIE = 'contentful_preview_session'

export const createPreviewSessionCookie = (secret: string, requestUrl: string): string => {
  const secure = new URL(requestUrl).protocol === 'https:' ? '; Secure' : ''
  return `${PREVIEW_SESSION_COOKIE}=${encodeURIComponent(secret)}; Max-Age=3600; Path=/; HttpOnly; SameSite=Lax${secure}`
}

export const hasPreviewSession = (request: Request, secret: string): boolean => {
  const cookieHeader = request.headers.get('Cookie')
  if (cookieHeader == null) return false

  const session = cookieHeader
    .split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${PREVIEW_SESSION_COOKIE}=`))
    ?.slice(PREVIEW_SESSION_COOKIE.length + 1)

  if (session == null) return false

  try {
    return constantTimeEqual(decodeURIComponent(session), secret)
  } catch {
    return false
  }
}

const constantTimeEqual = (a: string, b: string): boolean => {
  const aBytes = new TextEncoder().encode(a)
  const bBytes = new TextEncoder().encode(b)
  if (aBytes.length !== bBytes.length || aBytes.length === 0) return false

  let difference = 0
  for (let i = 0; i < aBytes.length; i++) {
    difference |= aBytes[i]! ^ bBytes[i]!
  }
  return difference === 0
}
