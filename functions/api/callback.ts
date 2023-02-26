import { coerceReponse, type PagesFunction, type Env } from './types'

type ResponseSuccess = { access_token: string }
type ResponseError = { error: string }

export const onRequest: PagesFunction<Env> = async (context) => {
  const {
    request, // same as existing Worker API
    env // same as existing Worker API
    // params, // if filename includes [id] or [[path]]
    // waitUntil, // same as ctx.waitUntil in existing Worker API
    // next, // used for middleware or to fetch assets
    // data // arbitrary space for passing data between middlewares
  } = context

  const clientId = env.GITHUB_CLIENT_ID
  const clientSecret = env.GITHUB_CLIENT_SECRET

  try {
    const url = new URL(request.url)
    const code = url.searchParams.get('code')
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'user-agent': 'cloudflare-functions-github-oauth-login-demo',
        accept: 'application/json'
      },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code })
    })
    const result = (await response.json()) as ResponseError | ResponseSuccess
    if ('error' in result) {
      return coerceReponse(renderBody('error', result), {
        headers: {
          'content-type': 'text/html;charset=UTF-8'
        },
        status: 401
      })
    }
    const token = result.access_token
    const provider = 'github'
    const responseBody = renderBody('success', {
      token,
      provider
    })
    return coerceReponse(responseBody, {
      headers: {
        'content-type': 'text/html;charset=UTF-8'
      },
      status: 200
    })
  } catch (error) {
    console.error(error)
    return coerceReponse((error as Error).message, {
      headers: {
        'content-type': 'text/html;charset=UTF-8'
      },
      status: 500
    })
  }
}

function renderBody(status: string, content: Record<string, unknown>) {
  const html = `
    <script>
      const receiveMessage = (message) => {
        window.opener.postMessage(
          'authorization:github:${status}:${JSON.stringify(content)}',
          message.origin
        );
        window.removeEventListener("message", receiveMessage, false);
      }
      window.addEventListener("message", receiveMessage, false);
      window.opener.postMessage("authorizing:github", "*");
    </script>
    `
  const blob = new Blob([html])
  return blob as unknown as BodyInit
}
