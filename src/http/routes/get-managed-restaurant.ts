import { Elysia } from 'elysia'
import { auth } from '../auth'
import { db } from '@/db/connection'

export const getManagedRestaurant = new Elysia()
  .use(auth)
  .get('/restaurants/info', async ({ jwt, cookie }) => {
    const authCookie = cookie.auth
    const payload = await jwt.verify(authCookie)
    if (!payload) {
      throw new Error('Unauthorized')
    }
    const { restaurantId } = payload
    if (!restaurantId) {
      throw new Error('Restaurat Id Missing')
    }
    const restaurant = await db.query.restaurants.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, restaurantId)
      },
    })
    if (!restaurant) {
      throw new Error('Restaurant Not Found')
    }
    return restaurant
  })
