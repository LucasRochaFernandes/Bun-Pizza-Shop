import { db } from '@/db/connection'
import dayjs from 'dayjs'
import { Elysia, t } from 'elysia'
import { auth } from '../auth'
import { authLinks } from '@/db/schema'
import { eq } from 'drizzle-orm'

export const authenticateFromLink = new Elysia().use(auth).get(
  '/sessions/link',
  async ({ query, jwt, setCookie, set }) => {
    const { code, redirect } = query
    const authLinkCode = await db.query.authLinks.findFirst({
      where(fields, { eq }) {
        return eq(fields.code, code)
      },
    })
    if (!authLinkCode) {
      throw new Error('Invalid Credentials')
    }
    const daysSinceAuthLinkWasCreated = dayjs().diff(
      authLinkCode.createdAt,
      'days',
    )
    if (daysSinceAuthLinkWasCreated > 7) {
      throw new Error('Auth Link Expired')
    }
    const managedRestaurant = await db.query.restaurants.findFirst({
      where(fields, { eq }) {
        return eq(fields.managerId, authLinkCode.userId)
      },
    })
    const token = await jwt.sign({
      sub: authLinkCode.userId,
      restaurantId: managedRestaurant?.id,
    })
    setCookie('auth', token, {
      httpOnly: true,
      maxAge: 60 * 60, // 1 hour
      path: '/',
    })
    await db.delete(authLinks).where(eq(authLinks.code, code))
    set.redirect = redirect
  },
  {
    query: t.Object({
      code: t.String(),
      redirect: t.String(),
    }),
  },
)
