import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { Landing } from './views/landing.js'


const app = new Hono()

app.get('/', (c) => {
  return c.html(<Landing />)
})

app.post('/topics', async (c) => {
  const data = await c.req.parseBody();
  console.log(data)
  return c.html(<div>Success!</div>)
})

app.use('/static/*', serveStatic({ root: './' }))

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
