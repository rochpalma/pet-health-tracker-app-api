const express = require('express');
const RemindersService = require('./reminders-service');
const remindersRouter = express.Router();
const jsonParser = express.json();

remindersRouter
  .route('/')
  .get((req, res, next) => {
    RemindersService.getAllReminders(req.app.get('db'))
      .then((reminders) => {
        res.json(reminders.map(RemindersService.serializeReminder));
      })

      .catch(next);
  })
.post(jsonParser, (req, res, next) => {
    const { dog_id, reminder_name , reminder_date, repeat, reminder_type, reminder_note } = req.body;
    const newReminder = { dog_id, reminder_name , reminder_date, repeat, reminder_type, reminder_note };

    for (const [key, value] of Object.entries(newReminder)) {
      if (value == null) {
        return res
          .status(400)
          .json({ error: { message: `Missing '${key}' in request body` } });
      }
    }
    
    RemindersService.insertReminder(req.app.get('db'), newReminder).then(
        (reminder) => {
          res.status(201).json(RemindersService.serializeReminder(reminder));
        })
        .catch(next);
  });

  remindersRouter
  .route('/:reminder_id')
  .all((req, res, next) => {
    RemindersService.getReminderById(req.app.get('db'), req.params.reminder_id).then(
      (reminder) => {
        if (!reminder) {
          return res
            .status(404)
            .json({ error: { message: `reminder doesn't exist` } });
        }
        res.reminder = reminder;
        next();
      }
    );
  })
  .get((req, res, next) => {
    res.json(RemindersService.serializeReminder(res.reminder));
  })
  .patch(jsonParser, (req, res, next) => {
    const {
        reminder_name ,
        reminder_date, 
        repeat, 
        reminder_type, 
        reminder_note
    } = req.body;
    const reminderToUpdate = {
        reminder_name ,
        reminder_date, 
        repeat, 
        reminder_type, 
        reminder_note
    };

    RemindersService.updateReminder(req.app.get('db'), req.params.reminder_id, reminderToUpdate)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = remindersRouter;