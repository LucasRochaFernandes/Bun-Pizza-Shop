import { Elysia } from 'elysia'
import { auth } from '../auth'
import { db } from '@/db/connection'

export const getProfile = new Elysia()
  .use(auth)
  .get('/me', async ({ cookie, jwt }) => {
    const authCookie = cookie.auth
    const payload = await jwt.verify(authCookie)
    if (!payload) {
      throw new Error('Unauthorized')
    }
    const { sub: userId } = payload

    const user = await db.query.users.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, userId)
      },
    })
    if (!user) {
      throw new Error('User Not Found')
    }
    return user
  })
