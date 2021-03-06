require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config');
const usersRouter = require('./users/users-router');
const authRouter = require('./auth/auth-router');
const dogsRouter = require('./dogs/dogs-router');
const eventsRouter = require('./events/events-router');
const activitiesRouter = require('./activities/activities-router');
const remindersRouter = require('./reminders/reminders-router');
const notesRouter = require('./notes/notes-router');
const medicationsRouter = require('./medications/medications-router');
const vaccinesRouter = require('./vaccines/vaccines-router');

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet());
app.use(cors());

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/dogs', dogsRouter);
// app.use('/api/activities', activitiesRouter);
app.use('/api/events', eventsRouter);
app.use('/api/reminders', remindersRouter);
app.use('/api/notes', notesRouter);
app.use('/api/medications', medicationsRouter);
app.use('/api/vaccines', vaccinesRouter);

app.get('/', (req, res) => {
    res.send('Hello, Pet Health Tracker User!')
})

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app