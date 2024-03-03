import cookie from '@elysiajs/cookie'
import jwt from '@elysiajs/jwt'
import { Elysia, t } from 'elysia'

export const auth = new Elysia()
  .use(
    jwt({
      secret: 'secret-key',
      schema: t.Object({
        sub: t.String(),
        restaurantId: t.Optional(t.String()),
      }),
    }),
  )
  .use(cookie())
