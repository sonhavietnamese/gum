'use server'

import { thirdwebClient } from '@/lib/thirdweb-client'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { VerifyLoginPayloadParams, createAuth } from 'thirdweb/auth'
import { privateKeyToAccount } from 'thirdweb/wallets'

const privateKey = process.env.THIRDWEB_ADMIN_PRIVATE_KEY || ''

if (!privateKey) {
  throw new Error('Missing THIRDWEB_ADMIN_PRIVATE_KEY in .env file.')
}

const thirdwebAuth = createAuth({
  domain: process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN || '',
  adminAccount: privateKeyToAccount({ client: thirdwebClient, privateKey }),
})

export const generatePayload = thirdwebAuth.generatePayload

export async function login(payload: VerifyLoginPayloadParams) {
  const verifiedPayload = await thirdwebAuth.verifyPayload(payload)

  const ck = await cookies()

  if (verifiedPayload.valid) {
    const jwt = await thirdwebAuth.generateJWT({
      payload: verifiedPayload.payload,
    })

    ck.set('jwt', jwt)

    return redirect('/game')
  }
}

export async function isLoggedIn() {
  const ck = await cookies()
  const jwt = ck.get('jwt')
  if (!jwt?.value) {
    return false
  }

  const authResult = await thirdwebAuth.verifyJWT({ jwt: jwt.value })
  if (!authResult.valid) {
    return false
  }
  return true
}

export async function logout() {
  const ck = await cookies()
  ck.delete('jwt')
  redirect('/')
}
