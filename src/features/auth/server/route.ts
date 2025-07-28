import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { signInSchema, signUpSchema } from '../schemas/auth-schemas'

const app = new Hono()
  .post('/sign-in', zValidator('json', signInSchema), async (c) => {
    const { email, password } = c.req.valid('json')

    console.log({ email, password })
    return c.json({
      success: 'ok'
    })
  })
  .post('/sign-up', zValidator('json', signUpSchema), async (c) => {
    const { email, password, confirmPassword, name } = c.req.valid('json')

    console.log({ email, name, password, confirmPassword })
    return c.json({
      success: 'ok'
    })
  })

export default app
