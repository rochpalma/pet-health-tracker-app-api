const express = require('express');
const EventsService = require('./events-service');
const eventsRouter = express.Router();
const jsonParser = express.json();

eventsRouter
  .route('/')
  .get((req, res, next) => {
    EventsService.getAllEvents(req.app.get('db'))
      .then((events) => {
        res.json(events.map(EventsService.serializeEvent));
      })

      .catch(next);
  })
.post(jsonParser, (req, res, next) => {
    const { dog_id, note_type, event_note, event_date } = req.body;
    const newEvent = { dog_id, note_type, event_note, event_date };

    for (const [key, value] of Object.entries(newEvent)) {
      if (value == null) {
        return res
          .status(400)
          .json({ error: { message: `Missing '${key}' in request body` } });
      }
    }
    
    EventsService.insertEvent(req.app.get('db'), newEvent).then(
        (event) => {
          res.status(201).json(EventsService.serializeEvent(event));
        })
        .catch(next);
  });

  eventsRouter
  .route('/:event_id')
  .all((req, res, next) => {
    EventsService.getDogById(req.app.get('db'), req.params.event_id).then(
      (event) => {
        if (!event) {
          return res
            .status(404)
            .json({ error: { message: `event doesn't exist` } });
        }
        res.event = event;
        next();
      }
    );
  })
  .get((req, res, next) => {
    res.json(EventsService.serializeDog(res.event));
  })
  .patch(jsonParser, (req, res, next) => {
    const {
        note_type, 
        event_note, 
        event_date
    } = req.body;
    const eventToUpdate = {
        note_type, 
        event_note, 
        event_date
    };

    EventsService.updateEvent(req.app.get('db'), req.params.event_id, eventToUpdate)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = eventsRouter;