import { Elysia } from 'elysia'
import { db } from 'src/db/connection'
import { restaurants, users } from 'src/db/schema'
import { z } from 'zod'

const app = new Elysia()

const createRestaurantSchema = z.object({
  restaurantName: z.string(),
  restaurantDescription: z.string(),
  managerName: z.string(),
  managerEmail: z.string().email(),
  managerPhone: z.string(),
})

app.post('/restaurants', async ({ body, set }) => {
  const {
    restaurantName,
    managerName,
    managerEmail,
    managerPhone,
    restaurantDescription,
  } = createRestaurantSchema.parse(body)
  const [manager] = await db
    .insert(users)
    .values({
      email: managerEmail,
      name: managerName,
      role: 'manager',
      phone: managerPhone,
    })
    .returning({
      id: users.id,
    })
  await db.insert(restaurants).values({
    name: restaurantName,
    description: restaurantDescription,
    managerId: manager.id,
  })

  set.status = 204
})

app.listen(3333, () => {
  console.log('Server Running')
})
