import mongoose from 'mongoose';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

import { Activity, Leaderboard, Team, User, Workout } from '../models/index.js';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);

    console.log('Connected to octofit_db');

    await Promise.all([
      Activity.deleteMany({}),
      Leaderboard.deleteMany({}),
      Team.deleteMany({}),
      User.deleteMany({}),
      Workout.deleteMany({}),
    ]);

    const users = await User.insertMany([
      { username: 'alex.runner', email: 'alex@example.com', displayName: 'Alex Rivera', avatar: 'AR' },
      { username: 'jamie.moves', email: 'jamie@example.com', displayName: 'Jamie Chen', avatar: 'JC' },
      { username: 'taylor.trains', email: 'taylor@example.com', displayName: 'Taylor Morgan', avatar: 'TM' },
    ]);

    const teams = await Team.insertMany([
      { name: 'Summit Crew', motto: 'Climb higher together', color: '#e76f51', members: [users[0]._id, users[1]._id] },
      { name: 'Pulse Makers', motto: 'Small steps, strong rhythm', color: '#2a9d8f', members: [users[2]._id] },
    ]);

    await Activity.insertMany([
      { user: users[0]._id, type: 'run', durationMinutes: 42, calories: 410, distanceKm: 6.8, completedAt: new Date('2026-09-03T07:30:00Z') },
      { user: users[1]._id, type: 'strength', durationMinutes: 35, calories: 280, completedAt: new Date('2026-09-04T18:00:00Z') },
      { user: users[2]._id, type: 'ride', durationMinutes: 55, calories: 520, distanceKm: 18.2, completedAt: new Date('2026-09-04T06:45:00Z') },
    ]);

    await Leaderboard.insertMany([
      { user: users[0]._id, team: teams[0]._id, points: 1240, rank: 1, streakDays: 12 },
      { user: users[2]._id, team: teams[1]._id, points: 1080, rank: 2, streakDays: 9 },
      { user: users[1]._id, team: teams[0]._id, points: 920, rank: 3, streakDays: 7 },
    ]);

    await Workout.insertMany([
      { title: 'Core Ignition', focus: 'Core', difficulty: 'beginner', durationMinutes: 20, exercises: ['Dead bug', 'Bird dog', 'Plank'] },
      { title: 'Hill Builder', focus: 'Legs and cardio', difficulty: 'intermediate', durationMinutes: 35, exercises: ['Goblet squat', 'Reverse lunge', 'Mountain climber'] },
      { title: 'Full-Body Power', focus: 'Strength', difficulty: 'advanced', durationMinutes: 45, exercises: ['Push-up', 'Kettlebell swing', 'Burpee'] },
    ]);

    console.log('Database seeding complete');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
