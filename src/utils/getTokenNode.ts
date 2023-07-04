import { createHmac } from 'node:crypto'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
// const secret = process.env.ENCRYTPTION_SECRET!

export const getToken = (secret: string, value: Record<string, unknown>) => {
  const hmac = createHmac('sha256', secret)
  hmac.update(JSON.stringify(value))
  const token = hmac.digest('hex')
  return token
}
