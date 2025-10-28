import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { Landing } from './views/landing.js'
import {
  createUser,
  getAllUsers,
  getUserById,
  getUserWithTopic,
  updateUser,
  deleteUser,
  proposeTopic,
  getAllTopics,
  getTopicById,
  getTopicWithMembers,
  updateTopic,
  deleteTopic,
  joinTopic,
  leaveTopic,
} from './db/queries.js'
import { TopicsList } from './views/topics-list.js'
import { auth } from './auth.js'
import { Signup } from './views/signup.js'
import { Login } from './views/signin.js'
import { requireAuth } from './middleware/auth.js'

const app = new Hono<
  {
    Variables: {
      user: typeof auth.$Infer.Session.user | null;
      session: typeof auth.$Infer.Session.session | null
    }
  }
>()

app.use('/static/*', serveStatic({ root: './' }))
app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));
app.use('/', requireAuth)
app.use('/topics/*', requireAuth)

// Landing page
app.get('/', async (c) => {
  try {
    const user = c.get("user")

    if (!user) return c.redirect('/login', 302)

    const topics = await getAllTopics()
    console.log(JSON.stringify(topics, null, 2))
    return c.html(<Landing currentUser={user} topics={topics} />)
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch topics' }, 500)
  }
})

app.get('/signup', async c => {
  return c.html(<Signup />)
})
app.get('/login', async c => {
  return c.html(<Login />)
})

// Create a topic
app.post('/topics', async (c) => {
  try {
    const user = c.get("user")
    if (!user) return c.redirect('/login', 302)

    const body = await c.req.parseBody();
    console.log(body.title, body.description)
    const title = body.title as string
    const description = body.description as string

    const creatorId = user.id

    if (!title || !description || !creatorId) {
      return c.json({
        success: false,
        error: 'Title, description, and creatorId are required'
      }, 400)
    }

    await proposeTopic(creatorId, title, description)
    const topics = await getAllTopics()
    return c.html(<TopicsList topics={topics} currentUser={user.id} />)
  } catch (error) {
    console.error(error);
    return c.json({ success: false, error: 'Failed to create topic' }, 500)
  }
})


app.post('/topics/:id/join', async (c) => {
  try {
    const user = c.get("user")
    if (!user) return c.redirect('/login', 302)

    const topicId = c.req.param('id')

    await joinTopic(user.id, topicId)

    const topics = await getAllTopics()
    return c.html(<TopicsList topics={topics} currentUser={user.id} />)
  } catch (error: any) {
    if (error.message?.includes('Topic not found')) {
      return c.json({ success: false, error: 'Topic not found' }, 404)
    }
    return c.json({ success: false, error: 'Failed to join topic' }, 500)
  }
})

app.post('/topics/:id/leave', async c => {
  try {
    const user = c.get("user")
    if (!user) return c.redirect('/login', 302)

    await leaveTopic(user.id)

    const topics = await getAllTopics()
    return c.html(<TopicsList topics={topics} currentUser={user.id} />)
  } catch (error: any) {
    if (error.message?.includes('Topic not found')) {
      return c.json({ success: false, error: 'Topic not found' }, 404)
    }
    return c.json({ success: false, error: 'Failed to leave topic' }, 500)
  }
})

// ===== USER CRUD OPERATIONS =====

// // Get all users
// app.get('/api/users', async (c) => {
//   try {
//     const users = await getAllUsers()
//     return c.json({ success: true, data: users })
//   } catch (error) {
//     return c.json({ success: false, error: 'Failed to fetch users' }, 500)
//   }
// })
//
// // Get user by ID
// app.get('/api/users/:id', async (c) => {
//   try {
//     const userId = c.req.param('id')
//     const user = await getUserWithTopic(userId)
//
//     if (!user) {
//       return c.json({ success: false, error: 'User not found' }, 404)
//     }
//
//     return c.json({ success: true, data: user })
//   } catch (error) {
//     return c.json({ success: false, error: 'Failed to fetch user' }, 500)
//   }
// })
//
// // Create new user
// app.post('/api/users', async (c) => {
//   try {
//     const body = await c.req.json()
//     const { email, name } = body
//
//     if (!email || !name) {
//       return c.json({ success: false, error: 'Email and name are required' }, 400)
//     }
//
//     const user = await createUser(email, name)
//     return c.json({ success: true, data: user }, 201)
//   } catch (error: any) {
//     if (error.message?.includes('UNIQUE constraint failed')) {
//       return c.json({ success: false, error: 'Email already exists' }, 409)
//     }
//     return c.json({ success: false, error: 'Failed to create user' }, 500)
//   }
// })
//
// // Update user
// app.put('/api/users/:id', async (c) => {
//   try {
//     const userId = c.req.param('id')
//     const body = await c.req.json()
//     const { email, name } = body
//
//     // Check if user exists
//     const existingUser = await getUserById(userId)
//     if (!existingUser) {
//       return c.json({ success: false, error: 'User not found' }, 404)
//     }
//
//     const updateData: { email?: string; name?: string } = {}
//     if (email !== undefined) updateData.email = email
//     if (name !== undefined) updateData.name = name
//
//     const updatedUser = await updateUser(userId, updateData)
//     return c.json({ success: true, data: updatedUser })
//   } catch (error: any) {
//     if (error.message?.includes('UNIQUE constraint failed')) {
//       return c.json({ success: false, error: 'Email already exists' }, 409)
//     }
//     return c.json({ success: false, error: 'Failed to update user' }, 500)
//   }
// })
//
// // Delete user
// app.delete('/api/users/:id', async (c) => {
//   try {
//     const userId = c.req.param('id')
//
//     // Check if user exists
//     const existingUser = await getUserById(userId)
//     if (!existingUser) {
//       return c.json({ success: false, error: 'User not found' }, 404)
//     }
//
//     const deletedUser = await deleteUser(userId)
//     return c.json({ success: true, data: deletedUser })
//   } catch (error) {
//     return c.json({ success: false, error: 'Failed to delete user' }, 500)
//   }
// })

// ===== TOPIC CRUD OPERATIONS =====

// // Get all topics
// app.get('/api/topics', async (c) => {
//   try {
//     const topics = await getAllTopics()
//     return c.json({ success: true, data: topics })
//   } catch (error) {
//     return c.json({ success: false, error: 'Failed to fetch topics' }, 500)
//   }
// })
//
// // Get topic by ID
// app.get('/api/topics/:id', async (c) => {
//   try {
//     const topicId = c.req.param('id')
//     const topic = await getTopicWithMembers(topicId)
//
//     if (!topic) {
//       return c.json({ success: false, error: 'Topic not found' }, 404)
//     }
//
//     return c.json({ success: true, data: topic })
//   } catch (error) {
//     return c.json({ success: false, error: 'Failed to fetch topic' }, 500)
//   }
// })
//
// // Create new topic (propose topic)
// app.post('/api/topics', async (c) => {
//   try {
//     const body = await c.req.json()
//     const { title, description, creatorId } = body
//
//     if (!title || !description || !creatorId) {
//       return c.json({
//         success: false,
//         error: 'Title, description, and creatorId are required'
//       }, 400)
//     }
//
//     // Check if creator exists
//     const creator = await getUserById(creatorId)
//     if (!creator) {
//       return c.json({ success: false, error: 'Creator user not found' }, 404)
//     }
//
//     const topic = await proposeTopic(creatorId, title, description)
//     return c.json({ success: true, data: topic }, 201)
//   } catch (error) {
//     return c.json({ success: false, error: 'Failed to create topic' }, 500)
//   }
// })
//
// // Update topic
// app.put('/api/topics/:id', async (c) => {
//   try {
//     const topicId = c.req.param('id')
//     const body = await c.req.json()
//     const { title, description } = body
//
//     // Check if topic exists
//     const existingTopic = await getTopicById(topicId)
//     if (!existingTopic) {
//       return c.json({ success: false, error: 'Topic not found' }, 404)
//     }
//
//     const updateData: { title?: string; description?: string } = {}
//     if (title !== undefined) updateData.title = title
//     if (description !== undefined) updateData.description = description
//
//     const updatedTopic = await updateTopic(topicId, updateData)
//     return c.json({ success: true, data: updatedTopic })
//   } catch (error) {
//     return c.json({ success: false, error: 'Failed to update topic' }, 500)
//   }
// })
//
// // Delete topic
// app.delete('/api/topics/:id', async (c) => {
//   try {
//     const topicId = c.req.param('id')
//
//     // Check if topic exists
//     const existingTopic = await getTopicById(topicId)
//     if (!existingTopic) {
//       return c.json({ success: false, error: 'Topic not found' }, 404)
//     }
//
//     const deletedTopic = await deleteTopic(topicId)
//     return c.json({ success: true, data: deletedTopic })
//   } catch (error) {
//     return c.json({ success: false, error: 'Failed to delete topic' }, 500)
//   }
// })
//
// // ===== TOPIC MEMBERSHIP OPERATIONS =====
//
// // Join a topic
// app.post('/api/topics/:id/join', async (c) => {
//   try {
//     const topicId = c.req.param('id')
//     const body = await c.req.json()
//     const { userId } = body
//
//     if (!userId) {
//       return c.json({ success: false, error: 'userId is required' }, 400)
//     }
//
//     // Check if user exists
//     const user = await getUserById(userId)
//     if (!user) {
//       return c.json({ success: false, error: 'User not found' }, 404)
//     }
//
//     const topic = await joinTopic(userId, topicId)
//     return c.json({ success: true, data: topic })
//   } catch (error: any) {
//     if (error.message?.includes('Topic not found')) {
//       return c.json({ success: false, error: 'Topic not found' }, 404)
//     }
//     return c.json({ success: false, error: 'Failed to join topic' }, 500)
//   }
// })
//
// // Leave current topic
// app.post('/api/users/:id/leave-topic', async (c) => {
//   try {
//     const userId = c.req.param('id')
//
//     // Check if user exists
//     const user = await getUserById(userId)
//     if (!user) {
//       return c.json({ success: false, error: 'User not found' }, 404)
//     }
//
//     await leaveTopic(userId)
//     return c.json({ success: true, message: 'Successfully left topic' })
//   } catch (error) {
//     return c.json({ success: false, error: 'Failed to leave topic' }, 500)
//   }
// })



serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})


