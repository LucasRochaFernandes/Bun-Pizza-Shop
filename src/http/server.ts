import { Elysia } from 'elysia'
import { registerRestaurant } from './routes/register-restaurant'
import { sendAuthLink } from './routes/send-auth-link'

const app = new Elysia()

app.use(registerRestaurant)
app.use(sendAuthLink)

app.listen(3333, () => {
  console.log('Server Running')
})
