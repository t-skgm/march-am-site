import { createHmac } from 'node:crypto'

export const getToken = (secret: string, value: Record<string, unknown>) => {
  const hmac = createHmac('sha256', secret)
  hmac.update(JSON.stringify(value))
  const token = hmac.digest('hex')
  return token
}
