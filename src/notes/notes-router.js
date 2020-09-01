const express = require('express');
const NotesService = require('./notes-service');
const notesRouter = express.Router();
const jsonParser = express.json();

notesRouter
  .route('/')
  .get((req, res, next) => {
    NotesService.getAllNotes(req.app.get('db'))
      .then((notes) => {
        res.json(notes.map(NotesService.serializeNote));
      })

      .catch(next);
  })
.post(jsonParser, (req, res, next) => {
    const { dog_id, event_name , note, note_type } = req.body;
    const newNote = { dog_id, event_name, note, note_type };

    for (const [key, value] of Object.entries(newNote)) {
      if (value == null) {
        return res
          .status(400)
          .json({ error: { message: `Missing '${key}' in request body` } });
      }
    }
    
    NotesService.insertNote(req.app.get('db'), newNote).then(
        (note) => {
          res.status(201).json(NotesService.serializeNote(note));
        })
        .catch(next);
  });

  notesRouter
  .route('/:note_id')
  .all((req, res, next) => {
    NotesService.getNotesById(req.app.get('db'), req.params.note_id).then(
      (note) => {
        if (!note) {
          return res
            .status(404)
            .json({ error: { message: `note doesn't exist` } });
        }
        res.note = note;
        next();
      }
    );
  })
  .get((req, res, next) => {
    res.json(NotesService.serializeNote(res.note));
  })
  .patch(jsonParser, (req, res, next) => {
    const {
        event_name ,
        note, 
        note_type
    } = req.body;
    const noteToUpdate = {
        event_name ,
        note, 
        note_type
    };

    NotesService.updateNote(req.app.get('db'), req.params.note_id, noteToUpdate)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = notesRouter;