import { Elysia } from 'elysia'
import { auth } from '../auth'
import { db } from '@/db/connection'
import { UnauthorizedError } from '../errors/unauthorized-error'

export const getProfile = new Elysia()
  .use(auth)
  .error({
    UNAUTHORIZED: UnauthorizedError,
  })
  .onError(({ error, code, set }) => {
    switch (code) {
      case 'UNAUTHORIZED': {
        set.status = 401
        return { code, message: error.message }
      }
    }
  })
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
      throw new UnauthorizedError()
    }
    return user
  })
