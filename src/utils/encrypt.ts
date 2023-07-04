// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
// const secret = process.env.ENCRYTPTION_SECRET!

export const getKey = async (secret: string) =>
  await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: { name: 'SHA-256' } },
    false,
    ['sign']
  )

export const getValidToken = async (secret: string, value: Record<string, unknown>) =>
  toHex(
    await crypto.subtle.sign(
      'HMAC',
      await getKey(secret),
      new TextEncoder().encode(JSON.stringify(value))
    )
  )

export const toHex = (arrayBuffer: ArrayBuffer): string =>
  Array.prototype.map
    .call(new Uint8Array(arrayBuffer), (n: number) => n.toString(16).padStart(2, '0'))
    .join('')
