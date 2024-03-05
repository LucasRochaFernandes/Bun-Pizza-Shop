import { Elysia } from 'elysia'
import { registerRestaurant } from './routes/register-restaurant'
import { sendAuthLink } from './routes/send-auth-link'
import { authenticateFromLink } from './routes/authenticate-from-link'
import { signOut } from './routes/sign-out'
import { getProfile } from './routes/get-profile'
import { getManagedRestaurant } from './routes/get-managed-restaurant'

const app = new Elysia()

app.use(authenticateFromLink)
app.use(registerRestaurant)
app.use(sendAuthLink)
app.use(signOut)
app.use(getManagedRestaurant)
app.use(getProfile)
app.listen(3333, () => {
  console.log('Server Running')
})
