import { authLinks } from '@/db/schema'
import { env } from '@/env'
import { mail } from '@/lib/mail'
import { Elysia } from 'elysia'
import { db } from 'src/db/connection'
import { z } from 'zod'
import nodemailer from 'nodemailer'

const sendAuthLinkSchema = z.object({
  email: z.string().email(),
})

export const sendAuthLink = new Elysia().post('/sessions', async ({ body }) => {
  const { email } = sendAuthLinkSchema.parse(body)
  const userFromEmail = await db.query.users.findFirst({
    where(fields, { eq }) {
      return eq(fields.email, email)
    },
  })
  if (!userFromEmail) {
    throw new Error('Invalid credentials')
  }
  const authLinkCode = crypto.randomUUID()

  await db.insert(authLinks).values({
    userId: userFromEmail.id,
    code: authLinkCode,
  })

  const authLink = new URL('/sessions/link', env.API_BASE_URL)
  authLink.searchParams.set('code', authLinkCode)
  authLink.searchParams.set('redirect', env.AUTH_REDIRECT_URL)
  const responseRequestMail = await mail.sendMail({
    from: {
      name: 'Pizza Shop',
      address: 'hi@pizzashop.com',
    },
    to: email,
    subject: 'Auth Link',
    text: `Use the link: ${authLink.toString()}`,
  })
  console.log(nodemailer.getTestMessageUrl(responseRequestMail))
})
