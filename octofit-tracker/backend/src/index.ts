import express from 'express'
import { connectDatabase } from './config/database.js'
import { Activity, Leaderboard, Team, User, Workout } from './models/index.js'

const app = express()
const port = Number(process.env.PORT) || 8000

app.use(express.json())

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' })
})

app.get('/api/users/', async (_request, response, next) => {
  try { response.json(await User.find().sort({ displayName: 1 })) } catch (error) { next(error) }
})

app.get('/api/teams/', async (_request, response, next) => {
  try { response.json(await Team.find().populate('members', 'displayName username')) } catch (error) { next(error) }
})

app.get('/api/activities/', async (_request, response, next) => {
  try { response.json(await Activity.find().populate('user', 'displayName username').sort({ completedAt: -1 })) } catch (error) { next(error) }
})

app.get('/api/leaderboard/', async (_request, response, next) => {
  try { response.json(await Leaderboard.find().populate('user', 'displayName username').populate('team', 'name color').sort({ rank: 1 })) } catch (error) { next(error) }
})

app.get('/api/workouts/', async (_request, response, next) => {
  try { response.json(await Workout.find().sort({ difficulty: 1, title: 1 })) } catch (error) { next(error) }
})

const codespaceName = process.env.CODESPACE_NAME
const apiUrl = codespaceName ? `https://${codespaceName}-8000.app.github.dev` : `http://localhost:${port}`

connectDatabase()
  .then(() => app.listen(port, () => console.log(`OctoFit API listening at ${apiUrl}`)))
  .catch((error) => {
    console.error('Unable to start OctoFit API:', error)
    process.exit(1)
  })