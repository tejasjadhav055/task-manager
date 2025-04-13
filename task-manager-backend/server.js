const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')

const app = express()
const PORT = 5000
const SECRET_KEY = 'your-secret-key-123'

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
)
app.use(bodyParser.json())

const DB_PATH = path.join(__dirname, 'db.json')

// Initialize database
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify({ users: [], tasks: [] }))
}

const readDB = () => JSON.parse(fs.readFileSync(DB_PATH))
const writeDB = (data) =>
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2))

// Authentication middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'No token provided' })

  try {
    const decoded = jwt.verify(token, SECRET_KEY)
    req.userId = decoded.userId
    next()
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' })
  }
}

// Routes
app.post('/register', async (req, res) => {
  const { username, password } = req.body
  const db = readDB()

  if (db.users.some((user) => user.username === username)) {
    return res.status(400).json({ message: 'Username already exists' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const newUser = { id: uuidv4(), username, password: hashedPassword }

  db.users.push(newUser)
  writeDB(db)

  res.status(201).json({ message: 'User registered successfully' })
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body
  const db = readDB()

  const user = db.users.find((user) => user.username === username)
  if (!user) return res.status(401).json({ message: 'Invalid credentials' })

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' })

  const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' })
  res.json({ token, userId: user.id })
})

// Task routes
app.get('/tasks', authenticate, (req, res) => {
  const db = readDB()
  const userTasks = db.tasks.filter((task) => task.userId === req.userId)
  res.json(userTasks)
})

app.post('/tasks', authenticate, (req, res) => {
  const { title, description } = req.body
  const db = readDB()

  const newTask = {
    id: uuidv4(),
    userId: req.userId,
    title,
    description: description || '',
    completed: false,
    createdAt: new Date().toISOString(),
  }

  db.tasks.push(newTask)
  writeDB(db)

  res.status(201).json(newTask)
})

app.put('/tasks/:id', authenticate, (req, res) => {
  const { id } = req.params
  const { title, description, completed } = req.body
  const db = readDB()

  const taskIndex = db.tasks.findIndex(
    (task) => task.id === id && task.userId === req.userId
  )
  if (taskIndex === -1)
    return res.status(404).json({ message: 'Task not found' })

  db.tasks[taskIndex] = {
    ...db.tasks[taskIndex],
    title: title || db.tasks[taskIndex].title,
    description: description || db.tasks[taskIndex].description,
    completed:
      completed !== undefined ? completed : db.tasks[taskIndex].completed,
  }

  writeDB(db)
  res.json(db.tasks[taskIndex])
})

app.delete('/tasks/:id', authenticate, (req, res) => {
  const { id } = req.params
  const db = readDB()

  const taskIndex = db.tasks.findIndex(
    (task) => task.id === id && task.userId === req.userId
  )
  if (taskIndex === -1)
    return res.status(404).json({ message: 'Task not found' })

  db.tasks.splice(taskIndex, 1)
  writeDB(db)

  res.json({ message: 'Task deleted successfully' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
