import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const key = new TextEncoder().encode(process.env.SESSION_SECRET || 'default_secret_please_change_me')

const cookieOptions = {
  name: 'session',
  expires: 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
}

export async function encrypt(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key)
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    return null
  }
}

export async function createSession(userId: string) {
  const expires = new Date(Date.now() + cookieOptions.expires)
  const session = await encrypt({ userId, expires })

  const cookieStore = await cookies()
  cookieStore.set(cookieOptions.name, session, { ...cookieOptions, expires })
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete(cookieOptions.name)
}

export async function getSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get(cookieOptions.name)?.value
  const payload = await decrypt(session)

  if (!session || !payload) {
    return null
  }

  return payload as { userId: string; expires: string }
}

export async function verifySession() {
  const cookieStore = await cookies()
  const session = cookieStore.get(cookieOptions.name)?.value
  const payload = await decrypt(session)

  if (!payload?.userId) {
    redirect('/login')
  }

  return { userId: payload.userId as string }
}
